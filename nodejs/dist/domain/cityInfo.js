"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CityInfo = /** @class */ (function () {
    function CityInfo(input) {
        var _this = this;
        this.getCityName = function () {
            return _this.name;
        };
        this.getInputs = function () {
            return _this.inputs;
        };
        this.name = input.name;
        this.inputs = input.inputs;
    }
    return CityInfo;
}());
exports.default = CityInfo;
