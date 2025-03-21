"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKPIidPerStatus = exports.getKPIByRole = exports.deleteById = exports.getById = exports.getAll = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const KPI_SELECT = {
    id: true,
    onderwerp: true,
    roles: true,
    grafiek: true,
};
const getAll = async () => {
    return data_1.prisma.kPI.findMany({
        select: KPI_SELECT,
    });
};
exports.getAll = getAll;
const getById = async (id) => {
    const kpi = await data_1.prisma.kPI.findUnique({
        where: {
            id,
        },
        select: KPI_SELECT,
    });
    if (!kpi) {
        throw serviceError_1.default.notFound('No kpi with this id exists');
    }
    return kpi;
};
exports.getById = getById;
const deleteById = async (id) => {
    try {
        await data_1.prisma.kPI.delete({
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
const getKPIByRole = async (role) => {
    const kpis = await data_1.prisma.kPI.findMany({
        where: {
            OR: [
                { roles: { equals: role } },
                { roles: { array_contains: role } },
            ],
        },
    });
    return kpis;
};
exports.getKPIByRole = getKPIByRole;
const getKPIidPerStatus = (status) => {
    const kpiMap = {
        'ALGEMENE_GEZONDHEID': 1,
        'SITE_GEZONDHEID': 2,
        'GEZOND': 5,
        'FALEND': 6,
        'NOOD_ONDERHOUD': 7,
        'AANKOMEND_ONDERHOUD': 8,
        'DRAAIT': 10,
        'MANUEEL_GESTOPT': 11,
        'AUTOMATISCH_GESTOPT': 12,
        'IN_ONDERHOUD': 13,
        'STARTBAAR': 14,
    };
    return kpiMap[status] || 0;
};
exports.getKPIidPerStatus = getKPIidPerStatus;
