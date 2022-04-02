import Repositories from "../repository/repositories";
import ScenariosService from "./scenarios";
import TasksService from "./tasks";

export default class Services {
    scenarios: ScenariosService
    tasks: TasksService
    constructor(repos:Repositories){
        this.scenarios = new ScenariosService(repos.scenarios)
        this.tasks = new TasksService(repos.tasks)
    }

    dispose = () => {
        this.tasks.dashaApi.dispose()
    }
}