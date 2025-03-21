"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.updateById = exports.create = exports.getById = exports.getAll = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const ADRES_SELECT = {
    id: true,
    straat: true,
    huisnummer: true,
    stadsnaam: true,
    postcode: true,
    land: true,
};
const getAll = async () => {
    return data_1.prisma.adres.findMany();
};
exports.getAll = getAll;
const getById = async (id) => {
    const adres = await data_1.prisma.adres.findUnique({
        where: {
            id,
        },
        select: ADRES_SELECT,
    });
    if (!adres) {
        throw serviceError_1.default.notFound('No adres with this id exists');
    }
    return adres;
};
exports.getById = getById;
const create = async ({ straat, huisnummer, stadsnaam, postcode, land, }) => {
    try {
        return await data_1.prisma.adres.create({
            data: {
                straat, huisnummer,
                stadsnaam,
                postcode,
                land,
            },
            select: ADRES_SELECT,
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.create = create;
const updateById = async (id, { straat, huisnummer, stadsnaam, postcode, land, }) => {
    try {
        return await data_1.prisma.adres.update({
            where: {
                id,
            },
            data: {
                straat,
                huisnummer,
                stadsnaam,
                postcode,
                land,
            },
            select: ADRES_SELECT,
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.updateById = updateById;
const deleteById = async (id) => {
    try {
        await data_1.prisma.adres.delete({
            where: {
                id,
            },
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.deleteById = deleteById;
