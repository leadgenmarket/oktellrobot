
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
        return result.modifiedCount>0?true:false
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
        const result: mongoDB.WithId<mongoDB.Document>[] = await this.collection.find({phone: { $ne: null }, cityName: { $ne: null }, finished: false, nextCallTime: { $lte: Math.floor(Date.now() / 1000)}}).toArray()
        let tasks = this.convertListToTaskList(result)
        return tasks
    }

    getUnfinishedTaskByPhone = async (phone: string): Promise<Task| null> => {
        let phoneS = phone.substring(1)
        const result: mongoDB.WithId<mongoDB.Document> | null = await this.collection.findOne({phone: {$regex : phoneS}, finished: false})
        let task: Task | null = null
        if (result!=null) {
            task = this.convertDocumentToTask(result)
        }
        return task
    }

    convertDocumentToTask = (document: mongoDB.Document): Task =>{
        let task = new Task(document._id, document.leadID, document.scenarioID, document.phone, document.cityName, document.tries, document.nextCallTime, document.success, document.finished)
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