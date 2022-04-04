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

export default class TasksService {
    repository: Repositories

    dashaApi?:  dasha.Application<Record<string, unknown>, Record<string, unknown>> | null = null
    constructor(repo: Repositories) {
        this.repository = repo
        dasha.deploy('./dasha').then((dashaDep: dasha.Application<Record<string, unknown>, Record<string, unknown>>)=>{
            this.dashaApi = dashaDep
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
      if (this.dashaApi == null) {
        console.log("not initialized yet")
        return false
      }
      var callsList = await this.repository.tasks.getTasksToCall()
      callsList.forEach(async (task) => {
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
                await this.repository.amoBuffer.add(new AmoBuffer("", 1, task.leadID, "", task.phone, scenario.successStatus, `Клиент ответил ДА (сценарий - ${scenario.name})`))
              } else {
                //добавляем коммент в лид, что не успешно
                await this.repository.amoBuffer.add(new AmoBuffer("", 1, task.leadID, "", task.phone, scenario.discardStatus, `Клиент ответил НЕТ (сценарий - ${scenario.name})`))
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
      })
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
      const audio = new AudioResources();
      audio.addFolder("audio");
      
      dashaApi.ttsDispatcher = (conv) => "custom";
      dashaApi.customTtsProvider = async (text, voice) => {
        console.log(`Tts asking for phrase with text ${text} and voice ${JSON.stringify(voice)}`);
        const fname = audio.GetPath(text, voice);

        console.log(`Found in file ${fname}`);
        return dasha.audio.fromFile(fname);
      };

      dashaApi.connectionProvider = async (conv) =>
        conv.input.phone === "chat"
          ? dasha.chat.connect(await dasha.chat.createConsoleChat())
          : dasha.sip.connect(new dasha.sip.Endpoint("default"));
    
      await dashaApi.start({concurrency:10});
    
      const conv = dashaApi.createConversation({ phone: phone, city:city });
    
      if (conv.input.phone !== 'chat') conv.on('transcription', console.log);
      const result = await conv.execute();
      
      await dashaApi.stop();

      let callResult = new CallResult(result.output.answered == true, result.output.positive_or_negative == true, result.output.ask_call_later == true)
      return callResult
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