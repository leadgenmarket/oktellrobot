"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallResult = /** @class */ (function () {
    function CallResult(answered, success, askedToCallLater, recordingURL) {
        var _this = this;
        this.isAnswered = function () {
            return _this.answered;
        };
        this.isSuccess = function () {
            return _this.success;
        };
        this.answered = answered;
        this.askedToCallLater = askedToCallLater;
        this.success = success;
        this.recordingURL = recordingURL;
    }
    CallResult.prototype.isAskedToCallLater = function () {
        return this.askedToCallLater;
    };
    CallResult.prototype.getRecordingURL = function () {
        return this.recordingURL;
    };
    return CallResult;
}());
exports.default = CallResult;
