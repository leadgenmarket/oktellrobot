
import * as mongoDB from "mongodb";
import AmoBuffer from "../domain/amoBuf";

export default class AmoBufferRepository {
    readonly collection: mongoDB.Collection
    constructor(db: mongoDB.Db, CollectionName:string) {
        this.collection = db.collection(CollectionName)
    }

    add = async (amoBuf: AmoBuffer) => {
        const result: mongoDB.InsertOneResult = await this.collection.insertOne(amoBuf);
        return result.acknowledged
    }

    update = async (amoBuf: AmoBuffer) => {
        const result: mongoDB.UpdateResult = await this.collection.updateOne({ _id: amoBuf._id }, amoBuf);
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
}