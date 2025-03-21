"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withServer_1 = __importDefault(require("../helpers/withServer"));
const data_1 = require("../../src/data");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const roles_1 = __importDefault(require("../../src/core/roles"));
const login_1 = require("../helpers/login");
jest.setTimeout(20000);
describe('Machines API', () => {
    let request;
    let adminAuthHeader;
    (0, withServer_1.default)((r) => (request = r));
    beforeAll(async () => {
        adminAuthHeader = await (0, login_1.loginAdmin)(request);
    });
    const url = '/api/machines';
    let createdMachine;
    beforeAll(async () => {
        await data_1.prisma.notificatie.deleteMany({});
        await data_1.prisma.kPIWaarde.deleteMany({});
        await data_1.prisma.kPI.deleteMany({});
        await data_1.prisma.machine.deleteMany({});
        await data_1.prisma.site.deleteMany({});
        await data_1.prisma.gebruiker.deleteMany({});
        await data_1.prisma.adres.deleteMany({});
        await data_1.prisma.adres.create({
            data: {
                id: 1,
                straat: 'Teststraat',
                huisnummer: '1A',
                stadsnaam: 'Teststad',
                postcode: '1234',
                land: 'Testland',
            },
        });
        await data_1.prisma.gebruiker.create({
            data: {
                id: 1,
                naam: 'Test User',
                voornaam: 'Test',
                geboortedatum: new Date(1990, 1, 1),
                email: 'user@test.com',
                wachtwoord: 'password',
                gsm: '1234567890',
                rol: roles_1.default.VERANTWOORDELIJKE,
                status: client_1.Status.ACTIEF,
                adres_id: 1,
            },
        });
        await data_1.prisma.site.create({
            data: {
                id: 1,
                naam: 'Test Site',
                verantwoordelijke_id: 1,
                status: client_1.Status.ACTIEF,
            },
        });
        await data_1.prisma.product.create({
            data: {
                id: 1,
                naam: 'Test Product',
            },
        });
        createdMachine = await data_1.prisma.machine.create({
            data: {
                code: 'MACHINE123',
                locatie: 'Test Location',
                product_informatie: 'Product info for machine',
                status: client_2.Machine_Status.DRAAIT,
                productie_status: client_2.Productie_Status.GEZOND,
                site_id: 1,
                product_id: 1,
                technieker_gebruiker_id: 1,
            },
        });
        const createdKPI = await data_1.prisma.kPI.create({
            data: {
                onderwerp: 'Productie Efficiëntie',
                roles: {
                    admin: true,
                    user: false,
                },
                grafiek: 'BAR',
            },
        });
        await data_1.prisma.kPIWaarde.create({
            data: {
                datum: new Date(),
                waarde: { score: 90 },
                site_id: '1',
                kpi_id: createdKPI.id,
            },
        });
    });
    afterAll(async () => {
        await data_1.prisma.kPIWaarde.deleteMany({});
        await data_1.prisma.kPI.deleteMany({});
        await data_1.prisma.product.deleteMany({});
    });
    it('should return 404 for a non-existent machine', async () => {
        const response = await request
            .get(`${url}/9999`)
            .set('Authorization', adminAuthHeader);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Machine niet gevonden');
    });
    it('should return 401 for a missing or invalid Authorization header', async () => {
        const response = await request
            .get(`${url}/${createdMachine.id}`)
            .set('Authorization', 'InvalidToken');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid authentication token');
    });
    it('should return 400 when updating a machine with invalid data', async () => {
        const updatedMachine = {
            code: '',
            locatie: 'Test Location',
            status: client_2.Machine_Status.MANUEEL_GESTOPT,
            productie_status: client_2.Productie_Status.GEZOND,
            site_id: 1,
            product_id: 1,
            technieker_gebruiker_id: 1,
        };
        const response = await request
            .put(`${url}/${createdMachine.id}`)
            .set('Authorization', adminAuthHeader)
            .send(updatedMachine);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed, check details for more information');
    });
    it('should return 404 for updating a non-existent machine', async () => {
        const updatedMachine = {
            code: 'MACHINE9999',
            locatie: 'New Location',
            status: client_2.Machine_Status.MANUEEL_GESTOPT,
            productie_status: client_2.Productie_Status.GEZOND,
            site_id: 1,
            product_id: 1,
            technieker_gebruiker_id: 1,
        };
        const response = await request
            .put(`${url}/9999`)
            .set('Authorization', adminAuthHeader)
            .send(updatedMachine);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Machine niet gevonden');
    });
    it('should return 400 when updating with missing required fields', async () => {
        const updatedMachine = {
            status: client_2.Machine_Status.MANUEEL_GESTOPT,
            productie_status: client_2.Productie_Status.GEZOND,
        };
        const response = await request
            .put(`${url}/${createdMachine.id}`)
            .set('Authorization', adminAuthHeader)
            .send(updatedMachine);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Validation failed, check details for more information');
    });
    it('should return 401 when not authorized', async () => {
        const response = await request.get(url);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You need to be signed in');
    });
    it('should return 500 if the database is unavailable', async () => {
        jest.spyOn(data_1.prisma.machine, 'findMany').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = await request.get(url).set('Authorization', adminAuthHeader);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
    });
});
