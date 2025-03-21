"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withServer;
const supertest_1 = __importDefault(require("supertest"));
const createServer_1 = __importDefault(require("../../src/createServer"));
const data_1 = require("../../src/data");
const password_1 = require("../../src/core/password");
const roles_1 = __importDefault(require("../../src/core/roles"));
const client_1 = require("@prisma/client");
function withServer(setter) {
    let server;
    beforeAll(async () => {
        server = await (0, createServer_1.default)();
        await data_1.prisma.notificatie.deleteMany({});
        await data_1.prisma.machine.deleteMany({});
        await data_1.prisma.site.deleteMany({});
        await data_1.prisma.gebruiker.deleteMany({});
        await data_1.prisma.adres.deleteMany({});
        const passwordHash = await (0, password_1.hashPassword)('UUBE4UcWvSZNaIw');
        await data_1.prisma.adres.create({
            data: {
                id: 1,
                straat: 'Teststraat',
                huisnummer: '1A',
                stadsnaam: 'Teststad',
                postcode: '1234AB',
                land: 'Testland',
            },
        });
        await data_1.prisma.gebruiker.createMany({
            data: [
                {
                    id: 1,
                    naam: 'Test User',
                    voornaam: 'Test',
                    geboortedatum: new Date(1990, 1, 1),
                    email: 'user@test.com',
                    wachtwoord: passwordHash,
                    gsm: '1234567890',
                    rol: JSON.stringify([roles_1.default.VERANTWOORDELIJKE]),
                    status: client_1.Status.ACTIEF,
                    adres_id: 1,
                },
                {
                    id: 2,
                    naam: 'Test Admin',
                    voornaam: 'admin',
                    geboortedatum: new Date(1990, 1, 1),
                    email: 'admin@test.com',
                    wachtwoord: passwordHash,
                    gsm: '1234567890',
                    rol: JSON.stringify([roles_1.default.MANAGER, roles_1.default.ADMINISTRATOR, roles_1.default.VERANTWOORDELIJKE]),
                    status: client_1.Status.ACTIEF,
                    adres_id: 1,
                },
            ],
        });
        await data_1.prisma.site.create({
            data: {
                id: 1,
                naam: 'Test Site',
                verantwoordelijke_id: 2,
                status: client_1.Status.ACTIEF,
            },
        });
        setter((0, supertest_1.default)(server.getApp().callback()));
    });
    afterAll(async () => {
        await data_1.prisma.notificatie.deleteMany({});
        await data_1.prisma.machine.deleteMany({});
        await data_1.prisma.site.deleteMany({});
        await data_1.prisma.gebruiker.deleteMany({});
        await data_1.prisma.adres.deleteMany({});
        await server.stop();
    });
}
