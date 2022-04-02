import  {Request, Response } from 'express';
import Scenario from '../domain/scenarios';
import ScenariosService from '../services/scenarios';
import Logger from "../utils/logger";

export default class ScenariosHandlers {
    protected scenarios: ScenariosService

    constructor(scenarios:ScenariosService) {
        this.scenarios = scenarios
    }

    addScenario = async (req: Request, res: Response) => {
        try{
            var scenario = new Scenario(req.body.id, req.body.name, req.body.phonesList, req.body.maxTries, req.body.successStatus, req.body.discardStatus, req.body.callsFinishedStatus, req.body.addDay)
        } catch (e) {
            res.status(400);
            Logger.error(`error parsing body addScenario handler`)
            res.json({ payload: "error parsing body", err: e})
            return
        }
        if (scenario.validate()!=="") {
            let msg = "addScenario: error in request check "+ scenario.validate() + " param"
            Logger.error(msg)
            res.status(400);
            res.json({ payload: msg})
            return
        }
        var result = await this.scenarios.add(scenario)
        if (result) {
            res.json({ payload: "success", id: scenario._id})
        } else {
            res.status(400);
            res.json({ payload: "error"})
        }
    }
}