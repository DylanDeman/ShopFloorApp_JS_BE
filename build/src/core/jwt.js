"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_util_1 = __importDefault(require("node:util"));
const JWT_AUDIENCE = config_1.default.get('auth.jwt.audience');
const JWT_SECRET = config_1.default.get('auth.jwt.secret');
const JWT_ISSUER = config_1.default.get('auth.jwt.issuer');
const JWT_EXPIRATION_INTERVAL = config_1.default.get('auth.jwt.expirationInterval');
const asyncJwtSign = node_util_1.default.promisify(jsonwebtoken_1.default.sign);
const asyncJwtVerify = node_util_1.default.promisify(jsonwebtoken_1.default.verify);
const generateJWT = async (user) => {
    const tokenData = { roles: user.rol };
    const signOptions = {
        expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL),
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
        subject: `${user.id}`,
    };
    return asyncJwtSign(tokenData, JWT_SECRET, signOptions);
};
exports.generateJWT = generateJWT;
const verifyJWT = async (authToken) => {
    const verifyOptions = {
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
    };
    return asyncJwtVerify(authToken, JWT_SECRET, verifyOptions);
};
exports.verifyJWT = verifyJWT;
