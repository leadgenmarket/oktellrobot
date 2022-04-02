import ScenariosRepository from "./scenarios";
import * as mongoDB from "mongodb";
import TasksRepository from "./tasks";
import AmoBufferRepository from "./amoBuffer";
const scenariosRepoName = "scenarios"
const tasksRepoName = "tasks"
const amoBufferRepoName = "amoBuf"

export default class Repositories {
    scenarios: ScenariosRepository
    tasks: TasksRepository
    amoBuffer: AmoBufferRepository
    constructor(client: mongoDB.MongoClient, DbName: string) {
       var db: mongoDB.Db = client.db(DbName)
       this.scenarios = new ScenariosRepository(db, scenariosRepoName)
       this.tasks = new TasksRepository(db, tasksRepoName)
       this.amoBuffer = new AmoBufferRepository(db, amoBufferRepoName)
    }
}