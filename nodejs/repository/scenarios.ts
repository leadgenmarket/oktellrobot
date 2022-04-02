import Scenario from "../domain/scenarios"
import * as mongoDB from "mongodb";

export default class ScenariosRepository {
    readonly collection: mongoDB.Collection
    constructor(db: mongoDB.Db, CollectionName:string) {
        this.collection = db.collection(CollectionName)
    }

    add = async (scenario: Scenario) => {
        const result: mongoDB.InsertOneResult = await this.collection.insertOne(scenario);
        return result.acknowledged
    }

    update = async (scenario: Scenario) => {
        const result: mongoDB.UpdateResult = await this.collection.updateOne({ _id: scenario._id }, scenario);
        return result.upsertedCount>0?true:false
    }

    delete = async (id: string) => {
        const result: mongoDB.DeleteResult = await this.collection.deleteOne({ _id: new mongoDB.ObjectId(id) });
        return result.deletedCount>0?true:false
    }
}