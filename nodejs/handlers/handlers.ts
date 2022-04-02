import { Express } from 'express';
import Services from '../services/services';
import ScenariosHandlers from './scenarios';

export default class Handlers {
    app: Express
    scenariosHandlers: ScenariosHandlers

    constructor(app:Express, services: Services) {
        this.app = app
        this.scenariosHandlers = new ScenariosHandlers(services.scenarios)
    }

    inintHandlers = () =>{
        //scenarios
        this.app.put("/scenario", this.scenariosHandlers.addScenario)
        console.log('initialized')
    }
}