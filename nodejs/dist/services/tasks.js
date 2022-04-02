"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var dasha = __importStar(require("@dasha.ai/sdk"));
var fs = require('fs');
var TasksService = /** @class */ (function () {
    function TasksService(repo) {
        var _this = this;
        this.add = function (task) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.add(task)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.update = function (task) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.update(task)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.delete = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.delete(id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.repository = repo;
        dasha.deploy('./dasha').then(function (dashaDep) {
            _this.dashaApi = dashaDep;
        });
    }
    //функция для совершения звонка
    TasksService.prototype.makeCall = function (phone, dashaApi) {
        return __awaiter(this, void 0, void 0, function () {
            var intents, conv, logFile, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        intents = [];
                        dashaApi.connectionProvider = function (conv) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!(conv.input.phone === 'chat')) return [3 /*break*/, 2];
                                        _c = (_b = dasha.chat).connect;
                                        return [4 /*yield*/, dasha.chat.createConsoleChat()];
                                    case 1:
                                        _a = _c.apply(_b, [_d.sent()]);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = dasha.sip.connect(new dasha.sip.Endpoint('default'));
                                        _d.label = 3;
                                    case 3: return [2 /*return*/, _a];
                                }
                            });
                        }); };
                        return [4 /*yield*/, dashaApi.start()];
                    case 1:
                        _a.sent();
                        conv = dashaApi.createConversation({ phone: phone });
                        if (conv.input.phone !== 'chat')
                            conv.on('transcription', console.log);
                        return [4 /*yield*/, fs.promises.open('./log.txt', 'w')];
                    case 2:
                        logFile = _a.sent();
                        return [4 /*yield*/, logFile.appendFile('#'.repeat(100) + '\n')];
                    case 3:
                        _a.sent();
                        conv.on('transcription', function (entry) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (entry.speaker == "human") {
                                            console.log(entry);
                                            console.log(entry.text);
                                        }
                                        return [4 /*yield*/, logFile.appendFile(entry.speaker + ": " + entry.text + "\n")];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        conv.on('debugLog', function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var logEntry;
                            var _a, _b, _c, _d, _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        if (!(((_a = event === null || event === void 0 ? void 0 : event.msg) === null || _a === void 0 ? void 0 : _a.msgId) === 'RecognizedSpeechMessage')) return [3 /*break*/, 2];
                                        if ((_c = (_b = event === null || event === void 0 ? void 0 : event.msg) === null || _b === void 0 ? void 0 : _b.results[0]) === null || _c === void 0 ? void 0 : _c.facts) {
                                            (_e = (_d = event === null || event === void 0 ? void 0 : event.msg) === null || _d === void 0 ? void 0 : _d.results[0]) === null || _e === void 0 ? void 0 : _e.facts.forEach(function (fact) {
                                                if (fact.intent) {
                                                    intents.push(fact.intent);
                                                }
                                            });
                                        }
                                        logEntry = (_g = (_f = event === null || event === void 0 ? void 0 : event.msg) === null || _f === void 0 ? void 0 : _f.results[0]) === null || _g === void 0 ? void 0 : _g.facts;
                                        return [4 /*yield*/, logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + '\n')];
                                    case 1:
                                        _h.sent();
                                        _h.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, conv.execute()];
                    case 4:
                        result = _a.sent();
                        console.log(result.output);
                        if (result.output.serviceStatus == "Done") {
                            console.log("звонок совершен");
                            console.log(intents);
                        }
                        else {
                            console.log("не дозвон");
                        }
                        return [4 /*yield*/, dashaApi.stop()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, logFile.close()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TasksService;
}());
exports.default = TasksService;
