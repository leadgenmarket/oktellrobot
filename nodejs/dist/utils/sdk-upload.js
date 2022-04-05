"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var uuid = require("node-uuid");
var csv = require("./csv-plugin");
var moment = require("moment");
var fs = require("fs");
var callData = new Map();
var headers = [
    { id: "key", title: "key" },
    { id: "phone", title: "phone" },
    { id: "handleStatus", title: "handleStatus" },
    { id: "status", title: "status" },
    { id: "serviceStatus", title: "serviceStatus" },
    { id: "callBackDetails", title: "callBackDetails" },
    { id: "record", title: "record" }
];
var writer;
function writeResult(writer, timestamp, input, output, custom) {
    writer.writeRecords([__assign(__assign(__assign({ timestamp: timestamp }, input), output), custom)]);
}
;
exports.default = {
    loadAndQueue: function (app, path, csvParams) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, data_1, dataRecord, uniqueId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, csv.load(path, csvParams)];
                    case 1:
                        data = _a.sent();
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            dataRecord = data_1[_i];
                            uniqueId = uuid.v4();
                            app.queue.push(uniqueId);
                            callData.set(uniqueId, dataRecord);
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    handleCalls: function (app, reportPath, onEnded) {
        var _this = this;
        writer = csv.createWriter(reportPath, headers);
        app.queue.on("ready", function (key, conv) { return __awaiter(_this, void 0, void 0, function () {
            var data, logFile, result, now, error_1, now;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = callData.get(key);
                        conv.input = data;
                        if (conv.input.phone !== "chat")
                            conv.on("transcription", console.log);
                        else {
                            console.warn("chat was rejected, use 'npm start chat ...' instead");
                            callData.delete(key);
                            if (callData.size == 0) {
                                onEnded();
                            }
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fs.promises.open("./logs/" + key + ".txt", "w")];
                    case 1:
                        logFile = _a.sent();
                        return [4 /*yield*/, logFile.appendFile("#".repeat(100) + "\n")];
                    case 2:
                        _a.sent();
                        conv.on("transcription", function (entry) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, logFile.appendFile(entry.speaker + ": " + entry.text + "\n")];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        conv.on("debugLog", function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var logEntry;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!(((_a = event === null || event === void 0 ? void 0 : event.msg) === null || _a === void 0 ? void 0 : _a.msgId) === "RecognizedSpeechMessage")) return [3 /*break*/, 2];
                                        logEntry = (_c = (_b = event === null || event === void 0 ? void 0 : event.msg) === null || _b === void 0 ? void 0 : _b.results[0]) === null || _c === void 0 ? void 0 : _c.facts;
                                        return [4 /*yield*/, logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + "\n")];
                                    case 1:
                                        _d.sent();
                                        _d.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, 6, 8]);
                        return [4 /*yield*/, conv.execute()];
                    case 4:
                        result = _a.sent();
                        console.log(result.output);
                        now = moment();
                        writeResult(writer, now, conv.input, result.output, {
                            key: key,
                            handleStatus: "Rejected",
                            record: result.recordingUrl
                        });
                        return [3 /*break*/, 8];
                    case 5:
                        error_1 = _a.sent();
                        now = moment();
                        console.error("Job " + key + " execution was failed. Error: " + error_1.name + ": " + error_1.message);
                        writeResult(writer, now, conv.input, null, { key: key, handleStatus: "Failed" });
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, logFile.close()];
                    case 7:
                        _a.sent();
                        callData.delete(key);
                        if (callData.size == 0) {
                            onEnded();
                        }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        app.queue.on("error", function (error) {
            console.error("Error " + error.name + ":" + error.message + ". Reason " + error.reason);
        });
        app.queue.on("rejected", function (key, error) {
            console.warn("Job " + key + " was rejected. Error " + error.name + ":" + error.message + ". Reason " + error.reason);
            var now = moment();
            writeResult(writer, now, callData.get(key), null, { key: key, handleStatus: "Rejected" });
            callData.delete(key);
            if (callData.size == 0) {
                onEnded();
            }
        });
        app.queue.on("timeout", function (key) {
            console.log("Job " + key + " was timed out");
            var now = moment();
            writeResult(writer, now, callData.get(key), null, { key: key, handleStatus: "Timeout" });
            callData.delete(key);
            if (callData.size == 0) {
                onEnded();
            }
        });
    },
};
