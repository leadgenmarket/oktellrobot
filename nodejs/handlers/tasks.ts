import  {Request, Response } from 'express';
import Task from "../domain/tasks";
import TasksService from "../services/tasks";
import Logger from "../utils/logger";
import {ObjectId} from "mongodb";

export default class TasksHandlers {
    protected tasks: TasksService

    constructor(tasks: TasksService) {
        this.tasks = tasks
    }

    addTask = async (req: Request, res: Response) => {
        try{
            var task = new Task(req.body.id, req.body.leadID, req.body.phone, req.body.tries, req.body.scenarioID, req.body.nextCallTime, req.body.success, req.body.finished)
        } catch (e) {
            res.status(400);
            Logger.error(`error parsing body addTask handler`)
            res.json({ payload: "error parsing body", err: e})
            return
        }
        if (task.validate()!=="") {
            let msg = "addTask: error in request check "+ task.validate() + " param"
            Logger.error(msg)
            res.status(400);
            res.json({ payload: msg})
            return
        }
        var result = await this.tasks.add(task)
        if (result) {
            res.json({ payload: "success", id: task._id})
        } else {
            res.status(400);
            res.json({ payload: "error"})
        }
    }

    deleteTask = async (req: Request, res: Response) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)){
            res.status(400);
            Logger.error(`deleteTask not valid id`)
            res.json({ payload: "not valid id"})
            return
        }
        var result = await this.tasks.delete(id)
        if (result) {
            res.json({ payload: "success"})
        } else {
            res.status(400);
            res.json({ payload: "error"})
        }
    }

    getAllTasks = async (req: Request, res: Response) => {
        var result = await this.tasks.list()
        res.json({ payload: result})
    }
}