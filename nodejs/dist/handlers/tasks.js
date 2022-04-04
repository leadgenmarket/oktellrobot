"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tasks_1 = __importDefault(require("../domain/tasks"));
var logger_1 = __importDefault(require("../utils/logger"));
var mongodb_1 = require("mongodb");
var TasksHandlers = /** @class */ (function () {
    function TasksHandlers(tasks) {
        var _this = this;
        this.addFromWebHook = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var scenarioID, leadID, task, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scenarioID = req.params.scenarioID;
                        console.log(scenarioID);
                        leadID = 0;
                        if (req.body.leads) {
                            if (req.body.leads.status) {
                                leadID = parseInt(req.body.leads.status[0].id);
                            }
                            if (req.body.leads.add) {
                                leadID = parseInt(req.body.leads.add[0].id);
                            }
                        }
                        task = new tasks_1.default("", leadID, scenarioID);
                        return [4 /*yield*/, this.tasks.add(task)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            res.json({ payload: "success", id: task._id });
                        }
                        else {
                            res.status(400);
                            res.json({ payload: "error" });
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.makeCalls = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tasks.makeCalls()];
                    case 1:
                        result = _a.sent();
                        res.json({ payload: result });
                        return [2 /*return*/];
                }
            });
        }); };
        //remove if not neded
        this.addTask = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var task, msg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            task = new tasks_1.default(req.body.id, req.body.leadID, req.body.scenarioID, req.body.phone, req.body.cityName, req.body.tries, req.body.nextCallTime, req.body.success, req.body.finished);
                        }
                        catch (e) {
                            res.status(400);
                            logger_1.default.error("error parsing body addTask handler");
                            res.json({ payload: "error parsing body", err: e });
                            return [2 /*return*/];
                        }
                        if (task.validate() !== "") {
                            msg = "addTask: error in request check " + task.validate() + " param";
                            logger_1.default.error(msg);
                            res.status(400);
                            res.json({ payload: msg });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.tasks.add(task)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            res.json({ payload: "success", id: task._id });
                        }
                        else {
                            res.status(400);
                            res.json({ payload: "error" });
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.deleteTask = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!mongodb_1.ObjectId.isValid(id)) {
                            res.status(400);
                            logger_1.default.error("deleteTask not valid id");
                            res.json({ payload: "not valid id" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.tasks.delete(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            res.json({ payload: "success" });
                        }
                        else {
                            res.status(400);
                            res.json({ payload: "error" });
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.getAllTasks = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tasks.list()];
                    case 1:
                        result = _a.sent();
                        res.json({ payload: result });
                        return [2 /*return*/];
                }
            });
        }); };
        this.test = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tasks.test(req.body.city)];
                    case 1:
                        _a.sent();
                        res.json({ payload: "ok" });
                        return [2 /*return*/];
                }
            });
        }); };
        this.tasks = tasks;
    }
    return TasksHandlers;
}());
exports.default = TasksHandlers;
