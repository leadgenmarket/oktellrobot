"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var Scenario = /** @class */ (function () {
    function Scenario(id, name, statusID, phonesList, maxTries, successStatus, discardStatus, callsFinishedStatus, addDay) {
        var _this = this;
        this.validate = function () {
            if (typeof _this._id == 'undefined') {
                return "_id";
            }
            if (typeof _this.name !== 'string') {
                return "name";
            }
            if (typeof _this.statusID !== 'number') {
                return "statusID";
            }
            if (typeof _this.phonesList !== 'object') {
                return "phonesList";
            }
            if (typeof _this.maxTries !== 'number') {
                return "maxTries";
            }
            if (typeof _this.successStatus !== 'number') {
                return "successStatus";
            }
            if (typeof _this.discardStatus !== 'number') {
                return "discardStatus";
            }
            if (typeof _this.callsFinishedStatus !== 'number') {
                return "callsFinishedStatus";
            }
            if (typeof _this.addDay !== 'boolean') {
                return "addDay";
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
        this.name = name;
        this.phonesList = phonesList;
        this.maxTries = maxTries;
        this.statusID = statusID;
        this.successStatus = successStatus;
        this.discardStatus = discardStatus;
        this.callsFinishedStatus = callsFinishedStatus;
        this.addDay = addDay;
    }
    return Scenario;
}());
exports.default = Scenario;
