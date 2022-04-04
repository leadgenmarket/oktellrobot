"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var checkTime_1 = __importDefault(require("../utils/checkTime"));
//надо добавить название города
var Task = /** @class */ (function () {
    function Task(id, leadID, scenarioID, phone, cityName, tries, nextCallTime, success, finished) {
        var _this = this;
        this.validate = function () {
            if (typeof _this._id == 'undefined') {
                return "_id";
            }
            if (typeof _this.leadID !== 'number') {
                return "leadID";
            }
            if (typeof _this.phone !== 'string' && _this.phone) {
                return "phone";
            }
            if (typeof _this.nextCallTime !== 'number' && _this.nextCallTime !== null) {
                return "nextCallTime";
            }
            if (typeof _this.cityName !== 'string' && _this.cityName) {
                return "cityName";
            }
            if (typeof _this.tries !== 'number') {
                return "tries";
            }
            if ((typeof _this.scenarioID !== 'string') || !mongodb_1.ObjectId.isValid(_this.scenarioID)) {
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
        this.nextCallTime = nextCallTime ? nextCallTime : checkTime_1.default(Math.floor(Date.now() / 1000));
        this.tries = tries ? tries : 0;
        this.cityName = cityName;
        this.scenarioID = scenarioID;
        this.success = success ? success : false;
        this.finished = finished ? finished : false;
    }
    return Task;
}());
exports.default = Task;
