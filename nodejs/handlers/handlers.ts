import { Express } from 'express';
import Services from '../services/services';
import ScenariosHandlers from './scenarios';
import TasksHandlers from './tasks';

export default class Handlers {
    app: Express
    scenariosHandlers: ScenariosHandlers
    tasksHandlers: TasksHandlers

    constructor(app:Express, services: Services) {
        this.app = app
        this.scenariosHandlers = new ScenariosHandlers(services.scenarios)
        this.tasksHandlers = new TasksHandlers(services.tasks)
    }

    initHandlers = () =>{
        //scenarios
        this.app.put("/scenario", this.scenariosHandlers.addScenario)
        this.app.post("/scenario", this.scenariosHandlers.updateScenario)
        this.app.delete("/scenario/:id", this.scenariosHandlers.deleteScenario)
        this.app.get("/scenario", this.scenariosHandlers.getAllScenarios)

        //tasks
        this.app.post('/task', this.tasksHandlers.addFromWebHook)
        this.app.delete("/task/:id", this.tasksHandlers.deleteTask)
        this.app.get("/task", this.tasksHandlers.getAllTasks)
        this.app.get("/task/call", this.tasksHandlers.makeCalls)
    }
}