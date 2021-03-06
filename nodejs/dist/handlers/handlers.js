"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scenarios_1 = __importDefault(require("./scenarios"));
var tasks_1 = __importDefault(require("./tasks"));
var Handlers = /** @class */ (function () {
    function Handlers(app, services) {
        var _this = this;
        this.initHandlers = function () {
            //scenarios
            _this.app.put("/scenario", _this.scenariosHandlers.addScenario);
            _this.app.post("/scenario", _this.scenariosHandlers.updateScenario);
            _this.app.delete("/scenario/:id", _this.scenariosHandlers.deleteScenario);
            _this.app.get("/scenario", _this.scenariosHandlers.getAllScenarios);
            //tasks
            _this.app.post('/task', _this.tasksHandlers.addFromWebHook);
            _this.app.delete("/task/:id", _this.tasksHandlers.deleteTask);
            _this.app.get("/task", _this.tasksHandlers.getAllTasks);
            _this.app.get("/task/call", _this.tasksHandlers.makeCalls);
        };
        this.app = app;
        this.scenariosHandlers = new scenarios_1.default(services.scenarios);
        this.tasksHandlers = new tasks_1.default(services.tasks);
    }
    return Handlers;
}());
exports.default = Handlers;
