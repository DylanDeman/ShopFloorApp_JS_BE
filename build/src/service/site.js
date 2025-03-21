"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSiteById = exports.updateSiteById = exports.createSite = exports.getSiteById = exports.getAllSites = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const roles_1 = __importDefault(require("../core/roles"));
const client_1 = require("@prisma/client");
const SITE_SELECT = {
    id: true,
    naam: true,
    status: true,
    verantwoordelijke: {
        select: {
            id: true,
            voornaam: true,
            naam: true,
        },
    },
    machines: {
        select: {
            id: true,
            locatie: true,
            status: true,
            productie_status: true,
            technieker: {
                select: {
                    id: true,
                    voornaam: true,
                    naam: true,
                },
            },
        },
    },
};
const getAllSites = async () => {
    try {
        const filters = { status: client_1.Status.ACTIEF };
        const sites = await data_1.prisma.site.findMany({
            where: filters,
            select: SITE_SELECT,
        });
        if (!sites.length) {
            throw serviceError_1.default.notFound('Geen sites gevonden.');
        }
        return sites;
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getAllSites = getAllSites;
const getSiteById = async (id) => {
    try {
        const site = await data_1.prisma.site.findUnique({
            where: { id },
            select: SITE_SELECT,
        });
        if (!site) {
            throw serviceError_1.default.notFound('Site niet gevonden.');
        }
        return site;
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getSiteById = getSiteById;
const createSite = async (data) => {
    try {
        const verantwoordelijke = await data_1.prisma.gebruiker.findUnique({
            where: { id: data.verantwoordelijke_id },
            select: { rol: true },
        });
        if (!verantwoordelijke) {
            throw new Error('Verantwoordelijke not found.');
        }
        const rol = verantwoordelijke.rol;
        if (!rol.includes(roles_1.default.VERANTWOORDELIJKE)) {
            throw new Error('The user is not a verantwoordelijke.');
        }
        if (!Object.values(client_1.Status).includes(data.status)) {
            throw new Error('Invalid status');
        }
        const site = await data_1.prisma.site.create({
            data: {
                naam: data.naam,
                verantwoordelijke_id: data.verantwoordelijke_id,
                status: data.status,
                machines: {
                    connect: data.machines_ids.map((machineId) => ({ id: machineId })),
                },
            },
            select: SITE_SELECT,
        });
        return site;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.createSite = createSite;
const updateSiteById = async (id, changes) => {
    try {
        if (!Object.values(client_1.Status).includes(changes.status)) {
            throw new Error('Invalid status');
        }
        const site = await data_1.prisma.site.update({
            where: {
                id,
            },
            data: {
                naam: changes.naam,
                verantwoordelijke_id: changes.verantwoordelijke_id,
                status: changes.status,
                machines: {
                    set: changes.machines_ids.map((machineId) => ({ id: machineId })),
                },
            },
            select: SITE_SELECT,
        });
        return site;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.updateSiteById = updateSiteById;
const deleteSiteById = async (id) => {
    try {
        const site = await data_1.prisma.site.update({
            where: { id },
            data: {
                status: 'INACTIEF',
            },
        });
        if (!site) {
            throw new Error('Site niet gevonden!');
        }
    }
    catch (error) {
        (0, _handleDBError_1.default)(error);
        throw new Error('An error occurred while deleting the user, please try again.');
    }
};
exports.deleteSiteById = deleteSiteById;
