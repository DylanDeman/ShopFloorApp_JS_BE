"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = exports.login = void 0;
const login = async (supertest) => {
    const response = await supertest.post('/api/sessions').send({
        email: 'user@test.com',
        password: 'UUBE4UcWvSZNaIw',
    });
    if (response.statusCode !== 200) {
        throw new Error(response.body.message || 'Unknown error occurred');
    }
    return `Bearer ${response.body.token}`;
};
exports.login = login;
const loginAdmin = async (supertest) => {
    const response = await supertest.post('/api/sessions').send({
        email: 'admin@test.com',
        password: 'UUBE4UcWvSZNaIw',
    });
    if (response.statusCode !== 200) {
        throw new Error(response.body.message || 'Unknown error occurred');
    }
    return `Bearer ${response.body.token}`;
};
exports.loginAdmin = loginAdmin;
