"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var Task = /** @class */ (function () {
    function Task(id, leadID, phone, nextCallTime, tries, scenarioID, success, finished) {
        if (id == "") {
            this._id = new mongodb_1.ObjectId(id);
        }
        else {
            this._id = mongodb_1.ObjectId.createFromTime(Date.now());
        }
        this.leadID = leadID;
        this.phone = phone;
        this.nextCallTime = nextCallTime;
        this.tries = tries;
        this.scenarioID = scenarioID;
        this.success = success;
        this.finished = finished;
    }
    return Task;
}());
exports.default = Task;
