"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.register = exports.login = exports.checkRole = exports.checkAndParseSession = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const serviceError_1 = __importDefault(require("../core/serviceError"));
const data_1 = require("../data");
const password_1 = require("../core/password");
const jwt_1 = require("../core/jwt");
const logging_1 = require("../core/logging");
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const client_1 = require("@prisma/client");
const makeExposedUser = ({ id, naam, voornaam, email, adres_id, gsm, geboortedatum, status, rol }) => ({
    id,
    naam,
    voornaam,
    email,
    adres_id,
    gsm,
    geboortedatum,
    status,
    rol,
});
const checkAndParseSession = async (authHeader) => {
    if (!authHeader) {
        throw serviceError_1.default.unauthorized('You need to be signed in');
    }
    if (!authHeader.startsWith('Bearer ')) {
        throw serviceError_1.default.unauthorized('Invalid authentication token');
    }
    const authToken = authHeader.substring(7);
    try {
        const { roles, sub } = await (0, jwt_1.verifyJWT)(authToken);
        return {
            userId: Number(sub),
            roles,
        };
    }
    catch (error) {
        (0, logging_1.getLogger)().error(error.message, { error });
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw serviceError_1.default.unauthorized('The token has expired');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw serviceError_1.default.unauthorized(`Invalid authentication token: ${error.message}`);
        }
        else {
            throw serviceError_1.default.unauthorized(error.message);
        }
    }
};
exports.checkAndParseSession = checkAndParseSession;
const checkRole = (role, roles) => {
    const hasPermission = roles.includes(role);
    if (!hasPermission) {
        throw serviceError_1.default.forbidden('You are not allowed to view this part of the application');
    }
};
exports.checkRole = checkRole;
const login = async (email, password) => {
    const gebruiker = await data_1.prisma.gebruiker.findUnique({ where: { email } });
    if (!gebruiker) {
        throw serviceError_1.default.unauthorized('The given email and password do not match');
    }
    const passwordValid = await (0, password_1.verifyPassword)(password, gebruiker.wachtwoord);
    if (!passwordValid) {
        throw serviceError_1.default.unauthorized('The given email and password do not match');
    }
    return await (0, jwt_1.generateJWT)(gebruiker);
};
exports.login = login;
const register = async ({ voornaam, naam, email, adres_id, wachtwoord, geboortedatum, gsm, rol, }) => {
    try {
        const passwordHash = await (0, password_1.hashPassword)(wachtwoord);
        const user = await data_1.prisma.gebruiker.create({
            data: {
                status: client_1.Status.ACTIEF,
                naam,
                voornaam,
                email,
                adres_id,
                wachtwoord: passwordHash,
                geboortedatum,
                gsm,
                rol: rol,
            },
        });
        return await (0, jwt_1.generateJWT)(user);
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.register = register;
const getAll = async () => {
    const users = await data_1.prisma.gebruiker.findMany();
    return users.map(makeExposedUser);
};
exports.getAll = getAll;
const getById = async (id) => {
    const gebruiker = await data_1.prisma.gebruiker.findUnique({ where: { id } });
    if (!gebruiker) {
        throw serviceError_1.default.notFound('No user with this id exists');
    }
    return makeExposedUser(gebruiker);
};
exports.getById = getById;
const updateById = async (id, changes) => {
    try {
        const user = await data_1.prisma.gebruiker.update({
            where: { id },
            data: changes,
        });
        return makeExposedUser(user);
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.updateById = updateById;
const deleteById = async (id) => {
    try {
        await data_1.prisma.gebruiker.delete({ where: { id } });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.deleteById = deleteById;
