"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withServer_1 = __importDefault(require("../helpers/withServer"));
const data_1 = require("../../src/data");
const roles_1 = __importDefault(require("../../src/core/roles"));
const client_1 = require("@prisma/client");
const login_1 = require("../helpers/login");
jest.setTimeout(20000);
describe('Sites API', () => {
    let request;
    let adminAuthHeader;
    (0, withServer_1.default)((r) => (request = r));
    beforeAll(async () => {
        adminAuthHeader = await (0, login_1.loginAdmin)(request);
        await data_1.prisma.machine.deleteMany({});
        await data_1.prisma.product.deleteMany({});
        await data_1.prisma.site.deleteMany({});
        await data_1.prisma.product.deleteMany({});
        await data_1.prisma.machine.deleteMany({});
        await data_1.prisma.gebruiker.deleteMany({});
        await data_1.prisma.adres.deleteMany({});
        await data_1.prisma.adres.createMany({
            data: [
                { id: 1, straat: 'Teststraat', huisnummer: '1A', stadsnaam: 'Teststad', postcode: '1234', land: 'Testland' },
            ],
        });
        await data_1.prisma.gebruiker.createMany({
            data: [
                { id: 1, naam: 'Test User', voornaam: 'Test', geboortedatum: new Date(1990, 1, 1), email: 'user@test.com',
                    wachtwoord: 'password', gsm: '1234567890', rol: roles_1.default.VERANTWOORDELIJKE,
                    status: client_1.Status.ACTIEF, adres_id: 1 },
            ],
        });
        await data_1.prisma.site.createMany({
            data: [{ id: 1, naam: 'Test Site', verantwoordelijke_id: 1, status: client_1.Status.ACTIEF }],
        });
        await data_1.prisma.product.create({
            data: {
                id: 1,
                naam: 'Test Product',
            },
        });
        await data_1.prisma.machine.create({
            data: {
                id: 1,
                code: 'MACHINE123',
                locatie: 'Test Location',
                product_informatie: 'Product info for machine',
                status: client_1.Machine_Status.DRAAIT,
                productie_status: client_1.Productie_Status.GEZOND,
                site_id: 1,
                product_id: 1,
                technieker_gebruiker_id: 1,
            },
        });
    });
    afterAll(async () => {
        await data_1.prisma.machine.deleteMany({});
        await data_1.prisma.product.deleteMany({});
        await data_1.prisma.site.deleteMany({});
        await data_1.prisma.gebruiker.deleteMany({});
        await data_1.prisma.adres.deleteMany({});
    });
    const url = '/api/sites';
    const newSite = {
        naam: 'New Site',
        verantwoordelijke_id: 1,
        status: client_1.Status.ACTIEF,
        machines_ids: [1],
    };
    describe('GET /api/sites', () => {
        it('should return all sites', async () => {
            const response = await request.get(url).set('Authorization', adminAuthHeader);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(1);
        });
    });
    describe('POST /api/sites', () => {
        it('should create a new site', async () => {
            const response = await request.post(url).set('Authorization', adminAuthHeader).send(newSite);
            expect(response.status).toBe(201);
            expect(response.body.naam).toBe(newSite.naam);
        });
    });
    describe('GET /api/sites/:id', () => {
        it('should return a site by ID', async () => {
            const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(1);
        });
    });
    describe('PUT /api/sites/:id', () => {
        it('should update a site', async () => {
            const updateData = { naam: 'Updated Site', verantwoordelijke_id: 1, status: 'ACTIEF', machines_ids: [1] };
            const response = await request.put(`${url}/1`).set('Authorization', adminAuthHeader).send(updateData);
            expect(response.status).toBe(200);
            expect(response.body.naam).toBe(updateData.naam);
        });
    });
    describe('DELETE /api/sites/:id', () => {
        it('should delete a site', async () => {
            const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);
            expect(response.status).toBe(204);
        });
    });
});
