import {ObjectId} from "mongodb";

export default class Task{
    _id?: ObjectId
    leadID: number
    phone: string
    nextCallTime: number
    tries: number
    scenarioID: number
    success: boolean
    finished: boolean

    constructor(id: string, leadID: number, phone: string, tries: number, scenarioID: number, nextCallTime?: number, success?: boolean, finished?: boolean){
        if (id !== "") {
            if (ObjectId.isValid(id)){
                this._id = new ObjectId(id)
            }
        } else {
            this._id = new ObjectId()
        }
        this.leadID = leadID
        this.phone = phone
        this.nextCallTime = nextCallTime?nextCallTime:new Date().getTime()
        this.tries = tries
        this.scenarioID = scenarioID
        this.success = success?success:false
        this.finished = finished?finished:false
    }

    validate = () => {
        if (typeof this._id == 'undefined') {
            return "_id"
        }
        if (typeof this.leadID !== 'number') {
            return "leadID"
        }
        if (typeof this.phone !== 'string') {
            return "phone"
        }
        if (typeof this.nextCallTime !== 'number') {
            return "nextCallTime"
        }
        if (typeof this.tries !== 'number') {
            return "tries"
        }
        if (typeof this.scenarioID !== 'number') {
            return "scenarioID"
        }
        if (typeof this.success !== 'boolean') {
            return "success"
        }
        if (typeof this.finished !== 'boolean') {
            return "finished"
        }

        return ""
    }
}