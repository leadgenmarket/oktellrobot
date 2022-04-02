import ScenariosRepository from "./scenarios";
import * as mongoDB from "mongodb";
import TasksRepository from "./tasks";
const scenariosRepoName = "scenarios"
const tasksRepoName = "tasks"

export default class Repositories {
    scenarios: ScenariosRepository
    tasks: TasksRepository
    constructor(client: mongoDB.MongoClient, DbName: string) {
       var db: mongoDB.Db = client.db(DbName)
       this.scenarios = new ScenariosRepository(db, scenariosRepoName)
       this.tasks = new TasksRepository(db, tasksRepoName)
    }
}