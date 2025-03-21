"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKPIWaardenByKPIid = exports.getById = exports.getAll = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const machine_1 = require("./machine");
const KPIWAARDE_SELECT = {
    id: true,
    datum: true,
    waarde: true,
    site_id: true,
};
const getAll = async () => {
    return data_1.prisma.kPIWaarde.findMany({
        select: KPIWAARDE_SELECT,
    });
};
exports.getAll = getAll;
const getById = async (id) => {
    const kpiwaarde = await data_1.prisma.kPIWaarde.findUnique({
        where: {
            id,
        },
        select: KPIWAARDE_SELECT,
    });
    if (!kpiwaarde) {
        throw serviceError_1.default.notFound('No kpiwaarde with this id exists');
    }
    return kpiwaarde;
};
exports.getById = getById;
const getKPIWaardenByKPIid = async (kpi_id) => {
    (0, machine_1.updateMachineKPIs)();
    return await data_1.prisma.kPIWaarde.findMany({
        where: {
            kpi_id,
        },
        select: KPIWAARDE_SELECT,
    });
};
exports.getKPIWaardenByKPIid = getKPIWaardenByKPIid;
