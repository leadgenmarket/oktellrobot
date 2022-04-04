
import * as mongoDB from "mongodb";
import Task from "../domain/tasks";

export default class TasksRepository {
    readonly collection: mongoDB.Collection
    constructor(db: mongoDB.Db, CollectionName:string) {
        this.collection = db.collection(CollectionName)
    }

    add = async (task: Task) => {
        const result: mongoDB.InsertOneResult = await this.collection.insertOne(task);
        return result.acknowledged
    }

    update = async (task: Task) => {
        const result: mongoDB.UpdateResult = await this.collection.updateOne({ _id: task._id }, {$set: task});
        return result.upsertedCount>0?true:false
    }

    delete = async (id: string) => {
        const result: mongoDB.DeleteResult = await this.collection.deleteOne({ _id: new mongoDB.ObjectId(id) });
        return result.deletedCount>0?true:false
    }

    list = async () : Promise<Task[]> => {
        const result: mongoDB.WithId<mongoDB.Document>[] = await this.collection.find().toArray()
        let tasks = this.convertListToTaskList(result)
        return tasks
    }

    getTasksToCall = async (): Promise<Task[]> => {
        const result: mongoDB.WithId<mongoDB.Document>[] = await this.collection.find({phone: { $ne: null }, cityName: { $ne: null }, finished: false}).toArray()
        let tasks = this.convertListToTaskList(result)
        return tasks
    }

    convertDocumentToTask = (document: mongoDB.Document): Task =>{
        let task = new Task(document.id, document.leadID, document.scenarioID, document.phone, document.cityName, document.tries, document.nextCallTime, document.success, document.finished)
        return task
    }

    convertListToTaskList = (documents: mongoDB.Document[]): Task[] => {
        let tasks: Task[] = []
        documents.forEach((document) => {
            tasks.push(this.convertDocumentToTask(document))
        })
        return tasks
    }
}