"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificatie = exports.updateNotificatieById = exports.getNotificatieById = exports.getAllNotificaties = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const NOTIFICATIE_SELECT = {
    id: true,
    bericht: true,
    tijdstip: true,
    gelezen: true,
};
const getAllNotificaties = async (page = 0, limit = 0) => {
    try {
        let notificaties;
        if (page === 0 || limit === 0) {
            notificaties = await data_1.prisma.notificatie.findMany({});
        }
        else {
            const skip = (page - 1) * limit;
            notificaties = await data_1.prisma.notificatie.findMany({
                skip: skip,
                take: limit,
            });
        }
        const total = await data_1.prisma.notificatie.count();
        if (!notificaties.length) {
            throw serviceError_1.default.notFound('Geen notificaties gevonden.');
        }
        return {
            items: notificaties.map((notificatie) => ({
                id: notificatie.id,
                bericht: notificatie.bericht,
                tijdstip: notificatie.tijdstip,
                gelezen: notificatie.gelezen,
            })),
            total,
        };
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getAllNotificaties = getAllNotificaties;
const getNotificatieById = async (id) => {
    try {
        const notificatie = await data_1.prisma.notificatie.findUnique({
            where: { id },
        });
        if (!notificatie) {
            throw serviceError_1.default.notFound('Notificatie niet gevonden');
        }
        return notificatie;
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getNotificatieById = getNotificatieById;
const updateNotificatieById = async (id, { tijdstip, bericht, gelezen }) => {
    try {
        const notificatie = await data_1.prisma.notificatie.update({
            where: { id },
            data: {
                tijdstip: tijdstip,
                bericht: bericht,
                gelezen: gelezen,
            },
        });
        return notificatie;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.updateNotificatieById = updateNotificatieById;
const createNotificatie = async (data) => {
    try {
        const notificatie = await data_1.prisma.notificatie.create({
            data: {
                bericht: data.bericht,
                tijdstip: data.tijdstip,
                gelezen: data.gelezen,
            },
            select: NOTIFICATIE_SELECT,
        });
        return notificatie;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.createNotificatie = createNotificatie;
