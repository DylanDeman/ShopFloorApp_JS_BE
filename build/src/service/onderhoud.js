"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnderhoud = exports.getOnderhoudById = exports.getAllOnderhouden = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const ONDERHOUD_SELECT = {
    id: true,
    machine_id: true,
    technieker_gebruiker_id: true,
    datum: true,
    starttijdstip: true,
    eindtijdstip: true,
    reden: true,
    status: true,
    opmerkingen: true,
};
const getAllOnderhouden = async () => {
    const onderhouden = await data_1.prisma.onderhoud.findMany();
    return {
        items: onderhouden.map((onderhoud) => ({
            id: onderhoud.id,
            machine_id: onderhoud.machine_id,
            technieker_gebruiker_id: onderhoud.technieker_gebruiker_id,
            datum: onderhoud.datum,
            starttijdstip: onderhoud.starttijdstip,
            eindtijdstip: onderhoud.eindtijdstip,
            reden: onderhoud.reden,
            status: onderhoud.status,
            opmerkingen: onderhoud.opmerkingen,
        })),
    };
};
exports.getAllOnderhouden = getAllOnderhouden;
const getOnderhoudById = async (id) => {
    try {
        const onderhoud = await data_1.prisma.onderhoud.findUnique({
            where: { id: id },
        });
        if (!onderhoud) {
            throw serviceError_1.default.notFound('Onderhoud niet gevonden!');
        }
        return onderhoud;
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getOnderhoudById = getOnderhoudById;
const createOnderhoud = async (data) => {
    try {
        const onderhoud = await data_1.prisma.onderhoud.create({
            data: {
                machine_id: data.machine_id,
                technieker_gebruiker_id: data.technieker_gebruiker_id,
                datum: data.datum,
                starttijdstip: data.starttijdstip,
                eindtijdstip: data.eindtijdstip,
                reden: data.reden,
                status: data.status,
                opmerkingen: data.opmerkingen,
            },
            select: ONDERHOUD_SELECT,
        });
        return onderhoud;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.createOnderhoud = createOnderhoud;
