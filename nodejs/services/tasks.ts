import Task from "../domain/tasks";
import TasksRepository from "../repository/tasks";
import * as dasha from "@dasha.ai/sdk"
import Repositories from "../repository/repositories";
import AmoBuffer from "../domain/amoBuf";
import Logger from "../utils/logger";
const fs = require('fs');

export default class TasksService {
    repository: Repositories

    dashaApi!:  dasha.Application<Record<string, unknown>, Record<string, unknown>>
    constructor(repo: Repositories) {
        this.repository = repo
        dasha.deploy('./dasha').then((dashaDep: dasha.Application<Record<string, unknown>, Record<string, unknown>>)=>{
            this.dashaApi = dashaDep
        })
    }

    add = async (task: Task) => {
        let scenario = await this.repository.scenarios.getById(task.scenarioID)

        //если сценарий не существует, то возвращаем ошибку
        if (scenario == null) {
          Logger.error("error adding new task: unknown scenario")
          return false
        }
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
      var callsList = await this.repository.tasks.getTasksToCall()
      callsList.forEach(async (task) => {
        let scenario = await this.repository.scenarios.getById(task.scenarioID)
        await this.makeCall(this.formatPhone(task.phone), this.dashaApi)
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
    protected async makeCall(phone: string, dashaApi: dasha.Application<Record<string, unknown>, Record<string, unknown>>) {
        let intents: string[] = [];
        dashaApi.connectionProvider = async (conv: any) =>
          conv.input.phone === 'chat'
            ? dasha.chat.connect(await dasha.chat.createConsoleChat())
            : dasha.sip.connect(new dasha.sip.Endpoint('default'));
      
        await dashaApi.start();
      
        const conv = dashaApi.createConversation({ phone: phone });
      
        if (conv.input.phone !== 'chat') conv.on('transcription', console.log);
      
        const logFile = await fs.promises.open('./log.txt', 'w');
        await logFile.appendFile('#'.repeat(100) + '\n');
      
        conv.on('transcription', async (entry: any) => {
          if (entry.speaker == "human") {
            console.log(entry)
            console.log(entry.text)
          }
          await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
        });
      
        conv.on('debugLog', async (event: any) => {
          if (event?.msg?.msgId === 'RecognizedSpeechMessage') {
            if (event?.msg?.results[0]?.facts) {
              event?.msg?.results[0]?.facts.forEach((fact:any) => {
                if (fact.intent) {
                  intents.push(fact.intent)
                }
              });
            }
            const logEntry = event?.msg?.results[0]?.facts;
            await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + '\n');
          }
        });
      
        const result = await conv.execute();
      
        console.log(result.output);
        if (result.output.serviceStatus == "Done") {
          console.log("звонок совершен")
          console.log(intents);
        } else {
          console.log("не дозвон")
        }
      
        await dashaApi.stop();
      
        await logFile.close();
    }
}