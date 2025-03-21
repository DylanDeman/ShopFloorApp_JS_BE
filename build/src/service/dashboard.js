"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardByUserID = exports.create = exports.deleteById = exports.getDashboardById = exports.getAllDashboards = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const getAllDashboards = async () => {
    try {
        const dashboards = await data_1.prisma.dashboard.findMany({
            include: {
                gebruiker: true,
                kpi: true,
            },
        });
        if (!dashboards.length) {
            throw serviceError_1.default.notFound('Geen dashboards gevonden.');
        }
        return dashboards.map((dashboard) => ({
            id: dashboard.id,
            gebruiker_id: dashboard.gebruiker.id,
            kpi_id: dashboard.kpi.id,
        }));
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getAllDashboards = getAllDashboards;
const getDashboardById = async (id) => {
    try {
        const dashboard = await data_1.prisma.dashboard.findUnique({
            where: { id },
            include: {
                gebruiker: true,
                kpi: true,
            },
        });
        if (!dashboard) {
            throw serviceError_1.default.notFound('Dashboard niet gevonden');
        }
        return {
            id: dashboard.id,
            gebruiker_id: dashboard.gebruiker.id,
            kpi_id: dashboard.kpi.id,
        };
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getDashboardById = getDashboardById;
const deleteById = async (id) => {
    try {
        await data_1.prisma.dashboard.delete({
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
const create = async ({ gebruiker_id, kpi_id, }) => {
    try {
        return await data_1.prisma.dashboard.create({
            data: {
                gebruiker_id,
                kpi_id,
            },
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.create = create;
const getDashboardByUserID = async (gebruiker_id) => {
    try {
        const dashboards = await data_1.prisma.dashboard.findMany({
            where: { gebruiker_id },
            include: {
                kpi: true,
            },
        });
        return dashboards.map((dashboard) => ({
            id: dashboard.id,
            gebruiker_id: dashboard.gebruiker_id,
            kpi_id: dashboard.kpi.id,
        }));
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getDashboardByUserID = getDashboardByUserID;
