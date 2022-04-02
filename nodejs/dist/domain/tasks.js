"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var Task = /** @class */ (function () {
    function Task(id, leadID, phone, tries, scenarioID, nextCallTime, success, finished) {
        var _this = this;
        this.validate = function () {
            if (typeof _this._id == 'undefined') {
                return "_id";
            }
            if (typeof _this.leadID !== 'number') {
                return "leadID";
            }
            if (typeof _this.phone !== 'string') {
                return "phone";
            }
            if (typeof _this.nextCallTime !== 'number') {
                return "nextCallTime";
            }
            if (typeof _this.tries !== 'number') {
                return "tries";
            }
            if (typeof _this.scenarioID !== 'number') {
                return "scenarioID";
            }
            if (typeof _this.success !== 'boolean') {
                return "success";
            }
            if (typeof _this.finished !== 'boolean') {
                return "finished";
            }
            return "";
        };
        if (id !== "") {
            if (mongodb_1.ObjectId.isValid(id)) {
                this._id = new mongodb_1.ObjectId(id);
            }
        }
        else {
            this._id = new mongodb_1.ObjectId();
        }
        this.leadID = leadID;
        this.phone = phone;
        this.nextCallTime = nextCallTime ? nextCallTime : new Date().getTime();
        this.tries = tries;
        this.scenarioID = scenarioID;
        this.success = success ? success : false;
        this.finished = finished ? finished : false;
    }
    return Task;
}());
exports.default = Task;
