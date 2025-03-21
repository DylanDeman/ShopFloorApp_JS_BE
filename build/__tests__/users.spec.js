"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withServer_1 = __importDefault(require("./helpers/withServer"));
const login_1 = require("./helpers/login");
const roles_1 = __importDefault(require("../src/core/roles"));
const client_1 = require("@prisma/client");
jest.setTimeout(20000);
describe('Users API', () => {
    let request;
    let authHeader;
    let adminAuthHeader;
    (0, withServer_1.default)((r) => (request = r));
    beforeAll(async () => {
        authHeader = await (0, login_1.login)(request);
        adminAuthHeader = await (0, login_1.loginAdmin)(request);
    });
    const usersUrl = '/api/users';
    describe('GET /api/users', () => {
        it('should return all users for an admin', async () => {
            const response = await request.get(usersUrl).set('Authorization', adminAuthHeader);
            expect(response.statusCode).toBe(200);
            expect(response.body.items.length).toBeGreaterThan(0);
        });
    });
    describe('POST /api/users', () => {
        it('should register a new user with all required fields', async () => {
            const response = await request.post(usersUrl)
                .send({
                naam: 'New User',
                voornaam: 'Test',
                geboortedatum: '1990-01-01T00:00:00.000Z',
                email: 'new.user@test.com',
                wachtwoord: 'SecurePass123!',
                gsm: '1234567890',
                rol: JSON.stringify([roles_1.default.VERANTWOORDELIJKE]),
                status: client_1.Status.ACTIEF,
                adres_id: 1,
            })
                .set('Authorization', authHeader);
            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });
    });
    it('should update a user with all required fields', async () => {
        const response = await request.put(`${usersUrl}/1`)
            .send({
            naam: 'Changed Name',
            voornaam: 'Changed',
            geboortedatum: '1991-02-02T00:00:00.000Z',
            email: 'changed.user@test.com',
            wachtwoord: 'NewSecurePass123!',
            gsm: '0987654321',
            rol: JSON.stringify([roles_1.default.TECHNIEKER]),
            status: client_1.Status.INACTIEF,
        })
            .set('Authorization', authHeader);
        expect(response.statusCode).toBe(200);
    });
    describe('PUT /api/users/:id', () => {
        it('should return validation error if required fields are missing', async () => {
            const response = await request.put(`${usersUrl}/1`)
                .send({})
                .set('Authorization', authHeader);
            expect(response.statusCode).toBe(400);
        });
    });
    describe('DELETE /api/users/:id', () => {
        it('should delete a user', async () => {
            const response = await request.delete(`${usersUrl}/1`).set('Authorization', authHeader);
            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
        });
    });
});
