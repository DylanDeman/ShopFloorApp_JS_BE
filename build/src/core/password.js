"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const config_1 = __importDefault(require("config"));
const argon2_1 = __importDefault(require("argon2"));
const ARGON_HASH_LENGTH = config_1.default.get('auth.argon.hashLength');
const ARGON_TIME_COST = config_1.default.get('auth.argon.timeCost');
const ARGON_MEMORY_COST = config_1.default.get('auth.argon.memoryCost');
const hashPassword = async (password) => {
    return argon2_1.default.hash(password, {
        type: argon2_1.default.argon2id,
        hashLength: ARGON_HASH_LENGTH,
        timeCost: ARGON_TIME_COST,
        memoryCost: ARGON_MEMORY_COST,
    });
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, passwordHash) => {
    return argon2_1.default.verify(passwordHash, password);
};
exports.verifyPassword = verifyPassword;
