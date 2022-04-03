
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
        const result: mongoDB.UpdateResult = await this.collection.updateOne({ _id: task._id }, task);
        return result.upsertedCount>0?true:false
    }

    delete = async (id: string) => {
        const result: mongoDB.DeleteResult = await this.collection.deleteOne({ _id: new mongoDB.ObjectId(id) });
        return result.deletedCount>0?true:false
    }

    list = async () => {
        const result: mongoDB.WithId<mongoDB.Document>[] = await this.collection.find().toArray()
        return result
    }

    getTasksToCall = async () => {
        const result: mongoDB.WithId<mongoDB.Document>[] = await this.collection.find({phone: { $ne: null }, cityName: { $ne: null }, finished: false}).toArray()
        return result
    }
}