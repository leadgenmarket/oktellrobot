"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallResult = /** @class */ (function () {
    function CallResult(answered, success, askedToCallLater, recordingURL, phoneNumber, cityInfo) {
        var _this = this;
        this.isAnswered = function () {
            return _this.answered;
        };
        this.setAnswered = function (flag) {
            _this.answered = flag;
        };
        this.isSuccess = function () {
            return _this.success;
        };
        this.answered = answered;
        this.askedToCallLater = askedToCallLater;
        this.success = success;
        this.recordingURL = recordingURL;
        this.phoneNumber = phoneNumber;
        this.cityInfo = cityInfo;
    }
    CallResult.prototype.isAskedToCallLater = function () {
        return this.askedToCallLater;
    };
    CallResult.prototype.getRecordingURL = function () {
        return this.recordingURL;
    };
    CallResult.prototype.getPhoneNumber = function () {
        return this.phoneNumber;
    };
    CallResult.prototype.getCityInfo = function () {
        return this.cityInfo;
    };
    return CallResult;
}());
exports.default = CallResult;
