"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("config"));
const NODE_ENV = config_1.default.get('env');
const LOG_LEVEL = config_1.default.get('log.level');
const LOG_DISABLED = config_1.default.get('log.disabled');
console.log(`node env: ${NODE_ENV}, log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);
const rootLogger = winston_1.default.createLogger({
    level: LOG_LEVEL,
    format: winston_1.default.format.simple(),
    transports: [new winston_1.default.transports.Console({ silent: LOG_DISABLED })],
});
const getLogger = () => {
    return rootLogger;
};
exports.getLogger = getLogger;
