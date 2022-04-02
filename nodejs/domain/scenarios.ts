import {ObjectId} from "mongodb";

export default class Scenario {
    _id?: ObjectId
    name: string
    phonesList: string[] //нужно или нет это поле?
    maxTries: number
    successStatus: number
    discardStatus: number
    callsFinishedStatus: number
    addDay: boolean

    constructor(id: string, name: string, phonesList: string[], maxTries: number, successStatus: number, discardStatus: number, callsFinishedStatus: number, addDay: boolean) {
        
        if (id !== "") {
            if (ObjectId.isValid(id)){
                this._id = new ObjectId(id)
            }
        } else {
            this._id = new ObjectId()
        }
        this.name = name
        this.phonesList = phonesList
        this.maxTries = maxTries
        this.successStatus = successStatus
        this.discardStatus = discardStatus
        this.callsFinishedStatus = callsFinishedStatus
        this.addDay = addDay
    }

    validate = () => {
        if (typeof this._id == 'undefined') {
            return "_id"
        }
        if (typeof this.name !== 'string') {
            return "name"
        }
        if (typeof this.phonesList !== 'object') {
            return "phonesList"
        }
        if (typeof this.maxTries !== 'number') {
            return "maxTries"
        }
        if (typeof this.successStatus !== 'number') {
            return "successStatus"
        }
        if (typeof this.discardStatus !== 'number') {
            return "discardStatus"
        }
        if (typeof this.callsFinishedStatus !== 'number') {
            return "callsFinishedStatus"
        }
        if (typeof this.addDay !== 'boolean') {
            return "addDay"
        }
        return ""
    }
}