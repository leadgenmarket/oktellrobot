import {ObjectId} from "mongodb";

//класс amoBuf, пишем задания для действий в crm для php
//php будет вычитывать пачками задания и выполнять действия в amocrm (если сразу все отправлять, amo может заблочить ip)
//узнать какие еще поля могут понадобиться для создания лида
export default class AmoBuffer {
    _id?: ObjectId
    type: number //0 - создаем лид, 1 - обновляем лид, 2 - получаем инфу из лида для таски (номер телефона)
    leadID: number //id лида в амо crm
    taskID: string //id таски(задания) на обзвон
    phone?: string
    newStatus?: number
    comment?: string 

    constructor(id: string, type: number, leadID: number, taskID: string, phone?:string, newStatus?:number, comment?: string){
        if (id !== "") {
            if (ObjectId.isValid(id)){
                this._id = new ObjectId(id)
            }
        } else {
            this._id = new ObjectId()
        }
        this.type = type
        this.leadID = leadID
        this.taskID = taskID
        this.phone = phone
        this.newStatus = newStatus
        this.comment = comment
    }
}