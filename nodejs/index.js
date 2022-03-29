const dasha = require('@dasha.ai/sdk');
const fs = require('fs');
const express = require('express');
const config = require('./config');
const { MongoClient } = require('mongodb');


// Constants
const HOST = '0.0.0.0';

const app = express();

const client = new MongoClient("mongodb://" + config.dsn);

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  makeCall('+79627681333').catch((error) => {
    console.error(error);
    //process.exitCode = 1;
  });
  res.json({ payload: "message" })
});

app.post('/', async (req, res) => {
  await client.connect()
  let task = { leadID: parseInt(req.body.leadID), phone: req.body.phone, tries: 0 }
  const tasksCollection = client.db("leadgen").collection("tasks");
  tasksCollection.insertOne(task, function (err, result) {
    if (err) {
      res.status(400);
      res.json({ payload: "error", data: err })
    }
    res.json({ payload: "success", data: result.insertedId })
  });
})

app.listen(config.port, HOST);
console.log(`Running on http://${HOST}:${config.port}`);

async function makeCall(phone) {

  const dashaApi = await dasha.deploy('./dasha');
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
  dashaApi.dispose();

  await logFile.close();
}
