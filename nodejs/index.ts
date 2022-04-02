import express, { Express, Request, Response } from 'express';
import bodyParser, { json } from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import * as mongoDB from "mongodb"
import * as expressPinoLogger from "express-pino-logger";
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
let services = new Services(repositories)
let handlers = new Handlers(app, services)
handlers.inintHandlers()




const server = app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

//gracefull shutdown
const serverGracefullShutdown = () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    client.close(() => {
      console.log('mongo client disposed');
      services.dispose()
    });
    process.exitCode = 1;
  });
  
}

process.on('SIGTERM', serverGracefullShutdown);

process.on('SIGINT', serverGracefullShutdown);