"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scenarios_1 = __importDefault(require("./scenarios"));
var Handlers = /** @class */ (function () {
    function Handlers(app, services) {
        var _this = this;
        this.inintHandlers = function () {
            //scenarios
            _this.app.put("/scenario", _this.scenariosHandlers.addScenario);
            console.log('initialized');
        };
        this.app = app;
        this.scenariosHandlers = new scenarios_1.default(services.scenarios);
    }
    return Handlers;
}());
exports.default = Handlers;
