import {ObjectId} from "mongodb";

//надо добавить название города
export default class Task{
    _id?: ObjectId
    leadID: number
    nextCallTime: number
    tries: number
    phone?: string
    cityName?:string
    scenarioID?: string
    success: boolean
    finished: boolean

    constructor(id: string, leadID: number, scenarioID?: string, phone?: string, cityName?:string, tries?: number, nextCallTime?: number, success?: boolean, finished?: boolean){
        if (id !== "") {
            if (ObjectId.isValid(id)){
                this._id = new ObjectId(id)
            }
        } else {
            this._id = new ObjectId()
        }
        this.leadID = leadID
        this.phone = phone
        this.nextCallTime = nextCallTime?nextCallTime:Math.floor(Date.now() / 1000)
        this.tries = tries?tries:0
        this.cityName = cityName
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
        if (typeof this.phone !== 'string' && this.phone) {
            return "phone"
        }
        if (typeof this.nextCallTime !== 'number' && this.nextCallTime !== null) {
            return "nextCallTime"
        }
        if (typeof this.cityName !== 'string' && this.cityName) {
            return "cityName"
        }
        if (typeof this.tries !== 'number') {
            return "tries"
        }
        if ((typeof this.scenarioID !== 'string') || !ObjectId.isValid(this.scenarioID)) {
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