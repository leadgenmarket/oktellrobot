"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
//класс amoBuf, пишем задания для действий в crm для php
//php будет вычитывать пачками задания и выполнять действия в amocrm (если сразу все отправлять, amo может заблочить ip)
//узнать какие еще поля могут понадобиться для создания лида
var AmoBuffer = /** @class */ (function () {
    function AmoBuffer(id, type, leadID, taskID, phone, newStatus, comment, city) {
        if (id !== "") {
            if (mongodb_1.ObjectId.isValid(id)) {
                this._id = new mongodb_1.ObjectId(id);
            }
        }
        else {
            this._id = new mongodb_1.ObjectId();
        }
        this.type = type;
        this.leadID = leadID;
        this.taskID = taskID;
        this.phone = phone;
        this.newStatus = newStatus;
        this.comment = comment;
        this.city = city;
    }
    return AmoBuffer;
}());
exports.default = AmoBuffer;
