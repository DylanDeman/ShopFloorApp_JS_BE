"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMachineKPIs = exports.updateMachineById = exports.getMachineById = exports.createMachine = exports.getAllMachines = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const kpi_1 = require("./kpi");
const SELECT_MACHINE = {
    id: true,
    product_id: true,
    code: true,
    locatie: true,
    status: true,
    product_informatie: true,
    productie_status: true,
    technieker: {
        select: {
            id: true,
            voornaam: true,
            naam: true,
        },
    },
    site: {
        select: {
            id: true,
            naam: true,
            verantwoordelijke: true,
        },
    },
    onderhouden: {
        select: {
            id: true,
            technieker: {
                select: {
                    id: true,
                    voornaam: true,
                    naam: true,
                },
            },
            datum: true,
            starttijdstip: true,
            eindtijdstip: true,
            reden: true,
            status: true,
            opmerkingen: true,
        },
    },
};
const getAllMachines = async () => {
    try {
        const machines = await data_1.prisma.machine.findMany({
            select: { ...SELECT_MACHINE },
        });
        if (!machines.length) {
            throw serviceError_1.default.notFound('Geen machines gevonden.');
        }
        return machines;
    }
    catch (error) {
        if (error instanceof serviceError_1.default) {
            throw error;
        }
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getAllMachines = getAllMachines;
const createMachine = async (data) => {
    try {
        const technieker = await data_1.prisma.gebruiker.findUnique({
            where: { id: data.technieker_gebruiker_id },
            select: { rol: true },
        });
        if (!technieker) {
            throw new Error('Technieker does not exist.');
        }
        if (technieker.rol !== 'TECHNIEKER') {
            throw new Error('The gebruiker is not a valid TECHNIEKER.');
        }
        const machine = await data_1.prisma.machine.create({
            data: {
                site_id: data.site_id,
                product_id: data.product_id,
                technieker_gebruiker_id: data.technieker_gebruiker_id,
                code: data.code,
                locatie: data.locatie,
                status: data.status,
                productie_status: data.productie_status,
                product_informatie: data.product_informatie,
            },
            include: {
                site: {
                    include: {
                        verantwoordelijke: true,
                    },
                },
                technieker: {
                    select: {
                        id: true,
                        naam: true,
                        voornaam: true,
                    },
                },
                product: true,
            },
        });
        return machine;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.createMachine = createMachine;
const getMachineById = async (id) => {
    try {
        const machine = await data_1.prisma.machine.findUnique({
            where: { id },
            select: SELECT_MACHINE,
        });
        if (!machine) {
            throw serviceError_1.default.notFound('Machine niet gevonden');
        }
        return machine;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.getMachineById = getMachineById;
const updateMachineById = async (id, { site_id, product_id, technieker_gebruiker_id, code, locatie, status, productie_status }) => {
    (0, exports.updateMachineKPIs)();
    try {
        const previousMachine = await data_1.prisma.machine.findUnique({
            where: { id },
            select: {
                status: true,
            },
        });
        if (!previousMachine) {
            throw serviceError_1.default.notFound('Machine niet gevonden');
        }
        const updateData = {
            product_id,
            technieker_gebruiker_id,
            code,
            locatie,
            status,
            productie_status,
        };
        if (site_id !== undefined) {
            updateData.site_id = site_id;
        }
        const machine = await data_1.prisma.machine.update({
            where: { id },
            data: updateData,
            select: SELECT_MACHINE,
        });
        if (previousMachine.status !== status) {
            await data_1.prisma.notificatie.create({
                data: {
                    bericht: `Machine ${machine.id} ${machine.status}`,
                },
            });
        }
        return machine;
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.updateMachineById = updateMachineById;
const updateMachineKPIs = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const machinesPerSite = await data_1.prisma.machine.groupBy({
            by: ['site_id', 'productie_status'],
            _count: { id: true },
        });
        const siteHealthData = {};
        machinesPerSite.forEach(({ site_id, productie_status, _count }) => {
            if (!siteHealthData[site_id]) {
                siteHealthData[site_id] = { gezond: 0, falend: 0 };
            }
            if (productie_status === 'GEZOND') {
                siteHealthData[site_id].gezond += _count.id;
            }
            else if (productie_status === 'FALEND' || productie_status === 'NOOD_ONDERHOUD') {
                siteHealthData[site_id].falend += _count.id;
            }
        });
        const kpiDataPerSite = Object.entries(siteHealthData).map(([site_id, { gezond, falend }]) => ({
            kpi_id: (0, kpi_1.getKPIidPerStatus)('SITE_GEZONDHEID'),
            datum: today,
            waarde: falend === 0 ? '1' : (gezond / falend),
            site_id: site_id,
        }));
        await data_1.prisma.kPIWaarde.createMany({
            data: kpiDataPerSite,
            skipDuplicates: true,
        });
        const totaalGezond = kpiDataPerSite.reduce((sum, { waarde }) => sum + parseFloat(String(waarde)), 0);
        const totaalSites = kpiDataPerSite.length;
        const algemeneGezondheid = totaalSites === 0 ? '0' : (totaalGezond / totaalSites).toFixed(2);
        await data_1.prisma.kPIWaarde.create({
            data: {
                kpi: {
                    connect: {
                        id: (0, kpi_1.getKPIidPerStatus)('ALGEMENE_GEZONDHEID'),
                    },
                },
                datum: today,
                waarde: algemeneGezondheid,
                site_id: null,
            },
        });
        const machinesPerStatus = await data_1.prisma.machine.groupBy({
            by: ['status'],
            _count: { id: true },
        });
        const KPI_data_machinesPerStatus = machinesPerStatus.map((statusgroep) => ({
            kpi_id: (0, kpi_1.getKPIidPerStatus)(statusgroep.status),
            datum: today,
            waarde: statusgroep._count.id.toString(),
            site_id: null,
        }));
        await data_1.prisma.kPIWaarde.createMany({
            data: KPI_data_machinesPerStatus,
            skipDuplicates: true,
        });
        const aankomendeOnderhoudsbeurten = await data_1.prisma.onderhoud.findMany({
            where: {
                datum: {
                    gt: today,
                },
            },
        });
        const onderhoudIds = aankomendeOnderhoudsbeurten.map((onderhoud) => onderhoud.id);
        const aankomendeOnderhoudsbeurtenKPIData = [{
                kpi_id: (0, kpi_1.getKPIidPerStatus)('AANKOMEND_ONDERHOUD'),
                datum: today,
                waarde: onderhoudIds.join(','),
            }];
        await data_1.prisma.kPIWaarde.createMany({
            data: aankomendeOnderhoudsbeurtenKPIData,
            skipDuplicates: true,
        });
        const machinesPerProductieStatus = await data_1.prisma.machine.findMany({
            select: {
                productie_status: true,
                id: true,
            },
            orderBy: {
                status: 'asc',
            },
        });
        const machinesPerProductieStatusGrouped = machinesPerProductieStatus.reduce((acc, machine) => {
            if (!acc[machine.productie_status]) {
                acc[machine.productie_status] = [];
            }
            acc[machine.productie_status]?.push(machine.id);
            return acc;
        }, {});
        const KPI_data_machinesPerProductieStatus = Object.entries(machinesPerProductieStatusGrouped).map(([productieStatus, ids]) => ({
            kpi_id: (0, kpi_1.getKPIidPerStatus)(productieStatus),
            datum: today,
            waarde: ids.join(','),
            site_id: null,
        }));
        await data_1.prisma.kPIWaarde.createMany({
            data: KPI_data_machinesPerProductieStatus,
            skipDuplicates: true,
        });
    }
    catch (error) {
        console.error(`Fout bij het updaten van machine KPI's: ${error}`);
    }
};
exports.updateMachineKPIs = updateMachineKPIs;
