"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scenarios_1 = __importDefault(require("./scenarios"));
var tasks_1 = __importDefault(require("./tasks"));
var scenariosRepoName = "scenarios";
var tasksRepoName = "tasks";
var Repositories = /** @class */ (function () {
    function Repositories(client, DbName) {
        var db = client.db(DbName);
        this.scenarios = new scenarios_1.default(db, scenariosRepoName);
        this.tasks = new tasks_1.default(db, tasksRepoName);
    }
    return Repositories;
}());
exports.default = Repositories;
