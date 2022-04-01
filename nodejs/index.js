const dasha = require('@dasha.ai/sdk');
const fs = require('fs');
const express = require('express');
const config = require('./config');
const { MongoClient, ObjectID } = require('mongodb');


// Constants
const HOST = '0.0.0.0';
const dbName = "leadgen";
const tasksCollection = "tasks";
const scenariosCollection = "scenarios";

const app = express();

const client = new MongoClient("mongodb://" + config.dsn);
var dashaApi
const initApp = async () => {
  await client.connect()
  dashaApi = await dasha.deploy('./dasha');
}
initApp()

app.use(express.json());
app.use(express.urlencoded());

//тут обрабатываем все задания по обзвону
app.get('/:phone', (req, res) => {
  let phone = req.params.phone
  makeCall(phone).catch((error) => {
    console.error(error);
    //process.exitCode = 1;
  });
  res.json({ payload: "message" })
});

//тут будут обрабатываться вебхуки amocrm
app.post('/', async (req, res) => {
  const tasksCollection = client.db(dbName).collection(tasksCollection);
  let task = { leadID: parseInt(req.body.leadID), phone: req.body.phone, tries: 0 }
  tasksCollection.insertOne(task, function (err, result) {
    if (err) {
      res.status(400);
      res.json({ payload: "error", data: err })
      return
    }
    res.json({ payload: "success", data: result.insertedId })
  });
})

//добавляет сценарии обзвонов
app.put('/scenario', async (req, res) => {
  const scenarios = client.db(dbName).collection(scenariosCollection);
  let scenario = { name: req.body.name, phonesList: req.body.phonesList, maxTries: req.body.maxTries, successStatus: req.body.successStatus, discardStatus: req.body.discardStatus, callsFinishedStatus: req.body.callsFinishedStatus, addDay: req.body.addDay }
  scenarios.insertOne(scenario, (err, result) => {
    if (err) {
      res.status(400);
      res.json({ payload: "error", data: err })
      return
    }
    res.json({ payload: "success", data: result.insertedId })
  })
})

//список сценариев обзвонов
app.get('/scenario', async (req, res) => {
  const scenarios = client.db(dbName).collection(scenariosCollection);
  let cursor = scenarios.find()
  const results = await cursor.toArray();
  res.json(results)
})

//удалить сценарий
app.delete('/scenario/:id', async (req, res) => {
  let id = req.params.id
  const scenarios = client.db(dbName).collection(scenariosCollection);
  scenarios.deleteOne({ _id: new ObjectID(id) }, (err, obj) => {
    if (err || obj.deletedCount == 0) {
      res.status(400);
      res.json({ payload: "error" })
      return
    }
    res.json({ payload: "success" })
  })
})

//обновить сценарий обзвонов
app.post('/scenario', async (req, res) => {
  const scenarios = client.db(dbName).collection(scenariosCollection);
  let scenario = { name: req.body.name, phonesList: req.body.phonesList, maxTries: req.body.maxTries, successStatus: req.body.successStatus, discardStatus: req.body.discardStatus, callsFinishedStatus: req.body.callsFinishedStatus, addDay: req.body.addDay }
  scenarios.updateOne({ _id: new ObjectID(req.body.id) }, { $set: scenario }, (err, result) => {
    if (err) {
      res.status(400);
      res.json({ payload: "error", data: err })
      return
    }
    res.json({ payload: "success", data: result.insertedId })
  })
})


//добавляет таску
app.put('/task', async (req, res) => {
  const scenarios = client.db(dbName).collection(scenariosCollection);
  const tasks = client.db(dbName).collection(tasksCollection);
  try {
    scenarios.findOne({ _id: new ObjectID(req.body.scenarioID) }).then((result) => {
      if (result != null) {
        let task = { leadID: req.body.leadID, phone: req.body.phone, nextCallTime: Date.now(), tries: 0, scenarioID: req.body.scenarioID, success: null, finished: false }
        tasks.insertOne(task, (err, result) => {
          if (err) {
            res.status(400);
            res.json({ payload: "error", data: err })
            return
          }
          res.json({ payload: "success", data: result.insertedId })
        })
      } else {
        res.status(400);
        res.json({ payload: "error", data: "no scenario id" })
      }
    })
  } catch (e) {
    res.status(400);
    res.json({ payload: "error", data: "no scenario id" })
  }
})

//список тасков обзвонов
app.get('/task', async (req, res) => {
  const tasks = client.db(dbName).collection(tasksCollection);
  let cursor = tasks.find()
  const results = await cursor.toArray();
  res.json(results)
})

//удалить таску
app.delete('/task/:id', async (req, res) => {
  let id = req.params.id
  const tasks = client.db(dbName).collection(tasksCollection);
  tasks.deleteOne({ _id: new ObjectID(id) }, (err, obj) => {
    if (err || obj.deletedCount == 0) {
      res.status(400);
      res.json({ payload: "error" })
      return
    }
    res.json({ payload: "success" })
  })
})



const server = app.listen(config.port, HOST);
console.log(`Running on http://${HOST}:${config.port}`);

//логика для совершения звонка
async function makeCall(phone) {
  let intents = [];
  dashaApi.connectionProvider = async (conv) =>
    conv.input.phone === 'chat'
      ? dasha.chat.connect(await dasha.chat.createConsoleChat())
      : dasha.sip.connect(new dasha.sip.Endpoint('default'));

  await dashaApi.start();

  const conv = dashaApi.createConversation({ phone: phone });

  if (conv.input.phone !== 'chat') conv.on('transcription', console.log);

  const logFile = await fs.promises.open('./log.txt', 'w');
  await logFile.appendFile('#'.repeat(100) + '\n');

  conv.on('transcription', async (entry) => {
    if (entry.speaker == "human") {
      console.log(entry)
      console.log(entry.text)
    }
    await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
  });

  conv.on('debugLog', async (event) => {
    if (event?.msg?.msgId === 'RecognizedSpeechMessage') {
      if (event?.msg?.results[0]?.facts) {
        event?.msg?.results[0]?.facts.forEach(fact => {
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

  /*
    result output

    если сбросить или не поднять
    {
      status: 'Failed',
      serviceStatus: 'ConnectionError',
      callBackDetails: null
    }

    если подняли прям текст идет
    {

    }

  */

  await dashaApi.stop();

  await logFile.close();
}

//gracefull shutdown
const serverGracefullShutdown = () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    client.close(() => {
      console.log('mongo client disposed');
    });
    console.log('dasha dispose');
    dashaApi.dispose();
  });
}

process.on('SIGTERM', serverGracefullShutdown);

process.on('SIGINT', serverGracefullShutdown);