"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallResult = /** @class */ (function () {
    function CallResult(answered, success, askedToCallLater) {
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
    }
    CallResult.prototype.isAskedToCallLater = function () {
        return this.askedToCallLater;
    };
    return CallResult;
}());
exports.default = CallResult;
