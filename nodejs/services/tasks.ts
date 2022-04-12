import Task from "../domain/tasks";
import TasksRepository from "../repository/tasks";
import * as dasha from "@dasha.ai/sdk"
import Repositories from "../repository/repositories";
import AmoBuffer from "../domain/amoBuf";
import Logger from "../utils/logger";
const fs = require('fs');
import AudioResources from "../utils/customTts"
import CallResult from "../domain/callResult";
import checkTime from "../utils/checkTime";

const citiesList: {[key:string]:string[]} = {
  "Санкт-Петербург": [
    "в спб",
    "питер",
    "питере",
    "санкт-петербург",
    "санктпетербург",
    "в санктпетербурге",
    "санкт",
    "в питере"
  ],
  "Ростов-на-Дону": [
    "рнд",
    "ростов",
    "ростове",
    "ростов-на-дону"
  ],
  "Москва": [
    "мск",
    "москва",
    "москве",
  ],
  "Новосибирск": [
    "новосиб",
    "новосибе",
    "новосибирске"
  ]
}

export default class TasksService {
    repository: Repositories

    dashaApi?:  dasha.Application<Record<string, unknown>, Record<string, unknown>> | null = null
    audio: AudioResources
    running: boolean = false

    constructor(repo: Repositories) {
        this.repository = repo
        //инициализируем папку с аудио
        this.audio = new AudioResources();
        this.audio.addFolder("audio");

        dasha.deploy('./dasha', { groupName: 'Default' }).then((dashaDep: dasha.Application<Record<string, unknown>, Record<string, unknown>>)=>{
            this.dashaApi = dashaDep

            //провайдер аудиозаписей
            this.dashaApi.customTtsProvider = async (text, voice) => {
              console.log(`Tts asking for phrase with text ${text} and voice ${JSON.stringify(voice)}`);
              const fname = this.audio.GetPath(text, voice);
      
              console.log(`Found in file ${fname}`);
              return dasha.audio.fromFile(fname);
            };

            //внешние функции
            for (const [func_name, func] of Object.entries(app_external_functions)) {
              this.dashaApi.setExternal(func_name, func);
            }
            this.inboundCallsReciver(this.dashaApi)
        })
       
    }

    add = async (task: Task, statusID: number) => {
        let scenario = await this.repository.scenarios.getByStatusID(statusID)

        //если сценарий не существует, то возвращаем ошибку
        if (scenario == null) {
          Logger.error("error adding new task: unknown scenario")
          return false
        }
        task.scenarioID = scenario._id.toHexString()
        var taskRes = await this.repository.tasks.add(task)

        //создаем задание в буфере, на получение из лида информации для php сервиса.
        if (taskRes && task._id) {
          let buf = new AmoBuffer("", 2, task.leadID, task._id.toHexString())
          let amoBufRes = await this.repository.amoBuffer.add(buf)
          if (amoBufRes) {
            return true
          } else {
            Logger.error("error adding amoBuf for new task")
            //удаляем таску в таком случае
            this.repository.tasks.delete(task._id.toHexString())
            return false
          }
        }
    }

    update = async (task: Task) => {
        var result = await this.repository.tasks.update(task)
        return result
    }

    delete = async (id: string) => {
        var result = await this.repository.tasks.delete(id)
        return result
    }

    list = async () => {
      var result = await this.repository.tasks.list()
      return result
    }

    makeCalls = async () => {
      if (this.running) {
        console.log("already running")
        return
      }
      if (this.dashaApi == null) {
        console.log("not initialized yet")
        return false
      }
      this.running = true
      var callsList = await this.repository.tasks.getTasksToCall()

      await this.dashaApi.start({concurrency:7});
      await Promise.all(callsList.map(async (task) => {
        let scenario = await this.repository.scenarios.getById(task.scenarioID!)
        if (scenario) {
          let result = await this.makeCall(this.formatPhone(task.phone!), task.cityName!, this.dashaApi!)
          if (result.isAnswered()) {
            //звонок был отвечен
            if (result.isAskedToCallLater()) {
              console.log("попросил перезвонить позже")
              //попросили перезвонить, перезваниваем через час
              task.tries -= 1 //тут отняли 1, чтобы счетчик кол-ва звонков не увеличился
            } else {
              //получили результат, закрываем звонки
              task.finished = true
              task.success = result.isSuccess()
              if (task.success) {
                //добавляем коммент в лид, что успешно
                await this.repository.amoBuffer.add(new AmoBuffer("", 1, task.leadID, "", task.phone, scenario.successStatus, `Клиент ответил ДА (сценарий - ${scenario.name}, запись - ${result.getRecordingURL()})`))
              } else {
                //добавляем коммент в лид, что не успешно
                await this.repository.amoBuffer.add(new AmoBuffer("", 1, task.leadID, "", task.phone, scenario.discardStatus, `Клиент ответил НЕТ (сценарий - ${scenario.name}), запись - ${result.getRecordingURL()})`))
              }
            }
          }
          //увеличиваем счетчик звонков
          task.tries += 1
          //если попросили перезвонить, то следующий звонок делаем через 2 часа (можно ли определять что занято?) 
          task.nextCallTime = result.isAskedToCallLater()?this.nowPlusHour():this.nowPlus2Hours()
          task.nextCallTime = checkTime(task.nextCallTime)
          //если кол-во звонков, больше кол-ва максимума в сценарии, то закрываем таску
          if (task.tries>=scenario.maxTries && !task.finished) {
            task.finished = true
            await this.repository.amoBuffer.add(new AmoBuffer("", 1, task.leadID, "", task.phone, scenario.callsFinishedStatus, `Не удалось дозвониться, по сценарию ${scenario.name}`))
          }
          
          await this.repository.tasks.update(task)
         
        }
      }))
      await this.dashaApi.stop();
      this.running = false
      return true
    }

    formatPhone = (phoneInput: string) => {
      let phone  = phoneInput.replace(/[^0-9\.]+/g, '')
      if (phone[0] == '8') {
        phone = "+7" + phone.substring(1)
      } else if  (phone[0] == '7') {
        phone = "+" + phone
      }
      return phone
    }

    //функция для совершения звонка
    protected async makeCall(phone: string, city:string, dashaApi: dasha.Application<Record<string, unknown>, Record<string, unknown>>):Promise<CallResult> {

      city = city.toLowerCase();
    
      const conv = dashaApi.createConversation({ phone: phone, city:city, outbound: true });

      conv.sip.config = "mtt_udp"
      conv.audio.tts = "custom";

      const chatMode = conv.input.phone === 'chat';

      if (!chatMode) {
        conv.on('transcription', console.log);
      } else {
        await dasha.chat.createConsoleChat(conv);
      }

      const result = await conv.execute({ channel: chatMode ? "text" : "audio" });

      console.log(result)
      let callResult = new CallResult(result.output.answered == true, result.output.positive_or_negative == true, result.output.ask_call_later == true, result.recordingUrl?result.recordingUrl:"")
      return callResult
    }

    //входящие звонки
    protected async inboundCallsReciver(dashaApi: dasha.Application<Record<string, unknown>, Record<string, unknown>>):Promise<boolean> {
      dashaApi.queue.on("ready", async (key, conv, info) => {
        console.log(info.sip);
        conv.audio.tts = "dasha";
        const result = await conv.execute({ channel: "audio" });
        console.log(result.output);
      });

      await dashaApi.start();
      console.log('inbound started')
      return true
    }

    protected nowPlusHour = ():number => {
      let time  = Math.floor(Date.now() / 1000)
      time += 3600
      return time
    }

    protected nowPlus2Hours = ():number => {
      let time  = Math.floor(Date.now() / 1000)
      time += 7200
      return time
    }
    protected nowPlus30Minutes = ():number => {
      let time  = Math.floor(Date.now() / 1000)
      time += 1800
      return time
    }
}

const app_external_functions = {
  getCity: async (argv: any, conv: any) => {
    const cityInput = argv.cityInfo;
    console.log(cityInput);

    let ret = cityInput;
    
    Object.keys(citiesList).map(city => {
      if (citiesList[city].includes(cityInput.inputs[cityInput.inputs.length-1])) {
        ret.name = city
      }
    });
    console.log(ret);
    return ret;
  },
}