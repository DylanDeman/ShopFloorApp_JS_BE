"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = exports.ping = void 0;
const config_1 = __importDefault(require("config"));
const package_json_1 = __importDefault(require("../../package.json"));
const ping = () => ({ pong: true });
exports.ping = ping;
const getVersion = () => ({
    env: config_1.default.get('env'),
    version: package_json_1.default.version,
    name: package_json_1.default.name,
});
exports.getVersion = getVersion;
