import Task from "../domain/tasks";
import TasksRepository from "../repository/tasks";
import * as dasha from "@dasha.ai/sdk"
const fs = require('fs');

export default class TasksService {
    repository: TasksRepository
    dashaApi!:  dasha.Application<Record<string, unknown>, Record<string, unknown>>
    constructor(repo: TasksRepository) {
        this.repository = repo
        dasha.deploy('./dasha').then((dashaDep: dasha.Application<Record<string, unknown>, Record<string, unknown>>)=>{
            this.dashaApi = dashaDep
        })
    }

    add = async (task: Task) => {
        //тут надо добавить проверку, что сценарий существует
        var result = await this.repository.add(task)
        return result
    }

    update = async (task: Task) => {
        var result = await this.repository.update(task)
        return result
    }

    delete = async (id: string) => {
        var result = await this.repository.delete(id)
        return result
    }

    list = async () => {
      var result = await this.repository.list()
      return result
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