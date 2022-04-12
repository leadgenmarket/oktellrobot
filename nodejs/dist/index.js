"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var helmet_1 = __importDefault(require("helmet"));
var dotenv_1 = __importDefault(require("dotenv"));
var mongoDB = __importStar(require("mongodb"));
var services_1 = __importDefault(require("./services/services"));
var repositories_1 = __importDefault(require("./repository/repositories"));
var handlers_1 = __importDefault(require("./handlers/handlers"));
dotenv_1.default.config();
var PORT = process.env.APP_PORT || 3000;
var dbName = "leadgen";
var app = express_1.default();
app.use(helmet_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//initializing db
var client = new mongoDB.MongoClient("mongodb://" + process.env.APP_DSN);
client.connect();
var repositories = new repositories_1.default(client, dbName);
var services = new services_1.default(repositories);
var handlers = new handlers_1.default(app, services);
handlers.initHandlers();
var server = app.listen(PORT, function () { return console.log("Running on " + PORT + " \u26A1"); });
//с интервалом в минуту смотрим нужно ли совершать звонки
/*let callsInterval = setInterval(async ()=>{
  console.log("make calls")
  await services.tasks.makeCalls()
}, 60000)*/
//gracefull shutdown
var serverGracefullShutdown = function () {
    console.info('SIGTERM signal received.');
    server.close(function () {
        console.log('Http server closed.');
        client.close(function () {
            console.log('mongo client disposed');
            services.dispose();
            //clearInterval(callsInterval)
        });
        process.exitCode = 1;
    });
};
process.on('SIGTERM', serverGracefullShutdown);
process.on('SIGINT', serverGracefullShutdown);
