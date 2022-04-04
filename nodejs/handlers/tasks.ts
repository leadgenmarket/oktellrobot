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

    addFromWebHook = async (req: Request, res: Response) => {
        let leadID: number = 0
        let statusID: number = 0
        if (req.body.leads){
            if (req.body.leads.status) {
                leadID = parseInt(req.body.leads.status[0].id)
                statusID = parseInt(req.body.leads.status[0].status_id)
            }

            if (req.body.leads.add) {
                leadID = parseInt(req.body.leads.add[0].id)
                statusID = parseInt(req.body.leads.add[0].status_id)
            }
        }
        if (statusID == 0 || leadID == 0) {
            res.status(400);
            res.json({ payload: "error"})
        }
        var task = new Task("", leadID)
        var result = await this.tasks.add(task, statusID)
        if (result) {
            res.json({ payload: "success", id: task._id})
        } else {
            res.status(400);
            res.json({ payload: "error"})
        }
    }

    makeCalls = async (req: Request, res: Response) => {
        let result = await this.tasks.makeCalls()
        res.json({ payload: result})
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