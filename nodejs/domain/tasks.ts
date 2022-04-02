import {ObjectId} from "mongodb";

export default class Task{
    _id: ObjectId
    leadID: number
    phone: string
    nextCallTime: Date
    tries: number
    scenarioID: number
    success: boolean
    finished: boolean

    constructor(id: string, leadID: number, phone: string, nextCallTime: Date, tries: number, scenarioID: number, success: boolean, finished: boolean){
        if (id == "") {
            this._id = new ObjectId(id)
        } else {
            this._id = ObjectId.createFromTime(Date.now())
        }
        this.leadID = leadID
        this.phone = phone
        this.nextCallTime = nextCallTime
        this.tries = tries
        this.scenarioID = scenarioID
        this.success = success
        this.finished = finished
    }
}