import express, { Express, Request, Response } from 'express';
import bodyParser, { json } from 'body-parser';
import {Server} from "http"
import helmet from 'helmet';
import dotenv from 'dotenv';
import * as mongoDB from "mongodb"
import Services from './services/services';
import Repositories from './repository/repositories';
import Handlers from './handlers/handlers';

dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const dbName = "leadgen" 
const app: Express = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//initializing db
const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://" + process.env.APP_DSN);
client.connect()

let repositories = new Repositories(client, dbName)

let services = new Services(repositories, process.env.APP_TYPE == "outbound")
let handlers = new Handlers(app, services)
handlers.initHandlers()



let server: Server
if (process.env.APP_TYPE == "outbound") {
  server = app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
}

let callsInterval: NodeJS.Timeout
if (process.env.APP_TYPE == "outbound") {
  //с интервалом в минуту смотрим нужно ли совершать звонки
  callsInterval = setInterval(async ()=>{
    console.log("make calls")
    await services.tasks.makeCalls()
  }, 60000)
}

//gracefull shutdown
const serverGracefullShutdown = () => {
  console.info('SIGTERM signal received.');
  if (process.env.APP_TYPE == "outbound") {
    server.close(() => {
      console.log('Http server closed.');
      client.close(() => {
        services.dispose()
        clearInterval(callsInterval)
      });
      process.exitCode = 1;
    });
  } else {
    client.close(() => {
      console.log('mongo client disposed')
      services.dispose()
      process.exitCode = 1
    });
  }
  
}

process.on('SIGTERM', serverGracefullShutdown);

process.on('SIGINT', serverGracefullShutdown);
