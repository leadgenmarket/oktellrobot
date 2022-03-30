const dasha = require('@dasha.ai/sdk');
const fs = require('fs');
const express = require('express');
const config = require('./config');
const { MongoClient } = require('mongodb');


// Constants
const HOST = '0.0.0.0';

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
app.get('/', (req, res) => {
  makeCall('+79627681333').catch((error) => {
    console.error(error);
    //process.exitCode = 1;
  });
  res.json({ payload: "message" })
});

//тут будут обрабатываться вебхуки amocrm
app.post('/', async (req, res) => {
  const tasksCollection = client.db("leadgen").collection("tasks");
  let task = { leadID: parseInt(req.body.leadID), phone: req.body.phone, tries: 0 }
  tasksCollection.insertOne(task, function (err, result) {
    if (err) {
      res.status(400);
      res.json({ payload: "error", data: err })
    }
    res.json({ payload: "success", data: result.insertedId })
  });
})

const server = app.listen(config.port, HOST);
console.log(`Running on http://${HOST}:${config.port}`);

//логика для совершения звонка
async function makeCall(phone) {
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
    await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
  });

  conv.on('debugLog', async (event) => {
    if (event?.msg?.msgId === 'RecognizedSpeechMessage') {
      const logEntry = event?.msg?.results[0]?.facts;
      await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + '\n');
    }
  });


  const result = await conv.execute();

  console.log(result.output);

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


