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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dasha = __importStar(require("@dasha.ai/sdk"));
var amoBuf_1 = __importDefault(require("../domain/amoBuf"));
var logger_1 = __importDefault(require("../utils/logger"));
var fs = require('fs');
var customTts_1 = __importDefault(require("../utils/customTts"));
var callResult_1 = __importDefault(require("../domain/callResult"));
var checkTime_1 = __importDefault(require("../utils/checkTime"));
var citiesList = {
    "Санкт-Петербург": [
        "в спб",
        "питер",
        "питере",
        "санкт-петербург",
        "санктпетербург",
        "в санктпетербурге",
        "санкт",
        "в питере"
    ],
    "Ростов-на-Дону": [
        "рнд",
        "ростов",
        "ростове",
        "ростов-на-дону"
    ],
    "Москва": [
        "мск",
        "москва",
        "москве",
    ],
    "Новосибирск": [
        "новосиб",
        "новосибе",
        "новосибирске"
    ]
};
var TasksService = /** @class */ (function () {
    function TasksService(repo) {
        var _this = this;
        this.dashaApi = null;
        this.running = false;
        this.add = function (task, statusID) { return __awaiter(_this, void 0, void 0, function () {
            var scenario, taskRes, buf, amoBufRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.scenarios.getByStatusID(statusID)
                        //если сценарий не существует, то возвращаем ошибку
                    ];
                    case 1:
                        scenario = _a.sent();
                        //если сценарий не существует, то возвращаем ошибку
                        if (scenario == null) {
                            logger_1.default.error("error adding new task: unknown scenario");
                            return [2 /*return*/, false];
                        }
                        task.scenarioID = scenario._id.toHexString();
                        return [4 /*yield*/, this.repository.tasks.add(task)
                            //создаем задание в буфере, на получение из лида информации для php сервиса.
                        ];
                    case 2:
                        taskRes = _a.sent();
                        if (!(taskRes && task._id)) return [3 /*break*/, 4];
                        buf = new amoBuf_1.default("", 2, task.leadID, task._id.toHexString());
                        return [4 /*yield*/, this.repository.amoBuffer.add(buf)];
                    case 3:
                        amoBufRes = _a.sent();
                        if (amoBufRes) {
                            return [2 /*return*/, true];
                        }
                        else {
                            logger_1.default.error("error adding amoBuf for new task");
                            //удаляем таску в таком случае
                            this.repository.tasks.delete(task._id.toHexString());
                            return [2 /*return*/, false];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.update = function (task) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.tasks.update(task)];
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
                    case 0: return [4 /*yield*/, this.repository.tasks.delete(id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.list = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.tasks.list()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.makeCalls = function () { return __awaiter(_this, void 0, void 0, function () {
            var callsList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.running) {
                            console.log("already running");
                            return [2 /*return*/];
                        }
                        if (this.dashaApi == null) {
                            console.log("not initialized yet");
                            return [2 /*return*/, false];
                        }
                        this.running = true;
                        return [4 /*yield*/, this.repository.tasks.getTasksToCall()];
                    case 1:
                        callsList = _a.sent();
                        return [4 /*yield*/, this.dashaApi.start({ concurrency: 7 })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(callsList.map(function (task) { return __awaiter(_this, void 0, void 0, function () {
                                var scenario, result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.repository.scenarios.getById(task.scenarioID)];
                                        case 1:
                                            scenario = _a.sent();
                                            if (!scenario) return [3 /*break*/, 11];
                                            return [4 /*yield*/, this.makeCall(this.formatPhone(task.phone), task.cityName, this.dashaApi)];
                                        case 2:
                                            result = _a.sent();
                                            if (!result.isAnswered()) return [3 /*break*/, 7];
                                            if (!result.isAskedToCallLater()) return [3 /*break*/, 3];
                                            console.log("попросил перезвонить позже");
                                            //попросили перезвонить, перезваниваем через час
                                            task.tries -= 1; //тут отняли 1, чтобы счетчик кол-ва звонков не увеличился
                                            return [3 /*break*/, 7];
                                        case 3:
                                            //получили результат, закрываем звонки
                                            task.finished = true;
                                            task.success = result.isSuccess();
                                            if (!task.success) return [3 /*break*/, 5];
                                            //добавляем коммент в лид, что успешно
                                            return [4 /*yield*/, this.repository.amoBuffer.add(new amoBuf_1.default("", 1, task.leadID, "", task.phone, scenario.successStatus, "\u041A\u043B\u0438\u0435\u043D\u0442 \u043E\u0442\u0432\u0435\u0442\u0438\u043B \u0414\u0410 (\u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0439 - " + scenario.name + ", \u0437\u0430\u043F\u0438\u0441\u044C - " + result.getRecordingURL() + ")"))];
                                        case 4:
                                            //добавляем коммент в лид, что успешно
                                            _a.sent();
                                            return [3 /*break*/, 7];
                                        case 5: 
                                        //добавляем коммент в лид, что не успешно
                                        return [4 /*yield*/, this.repository.amoBuffer.add(new amoBuf_1.default("", 1, task.leadID, "", task.phone, scenario.discardStatus, "\u041A\u043B\u0438\u0435\u043D\u0442 \u043E\u0442\u0432\u0435\u0442\u0438\u043B \u041D\u0415\u0422 (\u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0439 - " + scenario.name + "), \u0437\u0430\u043F\u0438\u0441\u044C - " + result.getRecordingURL() + ")"))];
                                        case 6:
                                            //добавляем коммент в лид, что не успешно
                                            _a.sent();
                                            _a.label = 7;
                                        case 7:
                                            //увеличиваем счетчик звонков
                                            task.tries += 1;
                                            //если попросили перезвонить, то следующий звонок делаем через 2 часа (можно ли определять что занято?) 
                                            task.nextCallTime = result.isAskedToCallLater() ? this.nowPlusHour() : this.nowPlus2Hours();
                                            task.nextCallTime = checkTime_1.default(task.nextCallTime);
                                            if (!(task.tries >= scenario.maxTries && !task.finished)) return [3 /*break*/, 9];
                                            task.finished = true;
                                            return [4 /*yield*/, this.repository.amoBuffer.add(new amoBuf_1.default("", 1, task.leadID, "", task.phone, scenario.callsFinishedStatus, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C\u0441\u044F, \u043F\u043E \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u044E " + scenario.name))];
                                        case 8:
                                            _a.sent();
                                            _a.label = 9;
                                        case 9: return [4 /*yield*/, this.repository.tasks.update(task)];
                                        case 10:
                                            _a.sent();
                                            _a.label = 11;
                                        case 11: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.dashaApi.stop()];
                    case 4:
                        _a.sent();
                        this.running = false;
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.formatPhone = function (phoneInput) {
            var phone = phoneInput.replace(/[^0-9\.]+/g, '');
            if (phone[0] == '8') {
                phone = "+7" + phone.substring(1);
            }
            else if (phone[0] == '7') {
                phone = "+" + phone;
            }
            return phone;
        };
        this.nowPlusHour = function () {
            var time = Math.floor(Date.now() / 1000);
            time += 3600;
            return time;
        };
        this.nowPlus2Hours = function () {
            var time = Math.floor(Date.now() / 1000);
            time += 7200;
            return time;
        };
        this.nowPlus30Minutes = function () {
            var time = Math.floor(Date.now() / 1000);
            time += 1800;
            return time;
        };
        this.repository = repo;
        //инициализируем папку с аудио
        this.audio = new customTts_1.default();
        this.audio.addFolder("audio");
        dasha.deploy('./dasha').then(function (dashaDep) {
            _this.dashaApi = dashaDep;
            //провайдер аудиозаписей
            _this.dashaApi.customTtsProvider = function (text, voice) { return __awaiter(_this, void 0, void 0, function () {
                var fname;
                return __generator(this, function (_a) {
                    console.log("Tts asking for phrase with text " + text + " and voice " + JSON.stringify(voice));
                    fname = this.audio.GetPath(text, voice);
                    console.log("Found in file " + fname);
                    return [2 /*return*/, dasha.audio.fromFile(fname)];
                });
            }); };
            //внешние функции
            for (var _i = 0, _a = Object.entries(app_external_functions); _i < _a.length; _i++) {
                var _b = _a[_i], func_name = _b[0], func = _b[1];
                _this.dashaApi.setExternal(func_name, func);
            }
            _this.inboundCallsReciver(_this.dashaApi);
        });
    }
    //функция для совершения звонка
    TasksService.prototype.makeCall = function (phone, city, dashaApi) {
        return __awaiter(this, void 0, void 0, function () {
            var conv, chatMode, result, callResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        city = city.toLowerCase();
                        conv = dashaApi.createConversation({ phone: phone, city: city, outbound: true });
                        conv.sip.config = "mtt_udp";
                        conv.audio.tts = "custom";
                        chatMode = conv.input.phone === 'chat';
                        if (!!chatMode) return [3 /*break*/, 1];
                        conv.on('transcription', console.log);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, dasha.chat.createConsoleChat(conv)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, conv.execute({ channel: chatMode ? "text" : "audio" })];
                    case 4:
                        result = _a.sent();
                        console.log(result);
                        callResult = new callResult_1.default(result.output.answered == true, result.output.positive_or_negative == true, result.output.ask_call_later == true, result.recordingUrl ? result.recordingUrl : "");
                        return [2 /*return*/, callResult];
                }
            });
        });
    };
    //входящие звонки
    TasksService.prototype.inboundCallsReciver = function (dashaApi) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.dashaApi == null) {
                            console.log("not initialized yet");
                            return [2 /*return*/, false];
                        }
                        dashaApi.queue.on("ready", function (key, conv, info) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log(info.sip);
                                        conv.audio.tts = "dasha";
                                        return [4 /*yield*/, conv.execute({ channel: "audio" })];
                                    case 1:
                                        result = _a.sent();
                                        console.log(result.output);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, dashaApi.start()];
                    case 1:
                        _a.sent();
                        console.log('inbound started');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return TasksService;
}());
exports.default = TasksService;
var app_external_functions = {
    getCity: function (argv, conv) { return __awaiter(void 0, void 0, void 0, function () {
        var cityInput, ret;
        return __generator(this, function (_a) {
            cityInput = argv.cityInfo;
            console.log(cityInput);
            ret = cityInput;
            Object.keys(citiesList).map(function (city) {
                if (citiesList[city].includes(cityInput.inputs[cityInput.inputs.length - 1])) {
                    ret.name = city;
                }
            });
            console.log(ret);
            return [2 /*return*/, ret];
        });
    }); },
};
