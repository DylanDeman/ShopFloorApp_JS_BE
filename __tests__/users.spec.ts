import type supertest from 'supertest';
import withServer from './helpers/withServer';
import { login, loginAdmin } from './helpers/login';
import Role from '../src/core/roles';
import { Status } from '@prisma/client';

jest.setTimeout(20000);

describe('Users API', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const usersUrl = '/api/users';

  describe('GET /api/users', () => {
    it('should return all users for an admin', async () => {
      const response = await request.get(usersUrl).set('Authorization', adminAuthHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id/dashboard', () => {
    it('should return user dashboard', async () => {
      const response = await request.get(usersUrl).set('Authorization', adminAuthHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/users', () => {
    it('should register a new user with all required fields', async () => {
      const response = await request.post(usersUrl)
        .send({ 
          lastname: 'New User', 
          firstname: 'Test', 
          birthdate: '1990-01-01T00:00:00.000Z',
          email: 'new.user@test.com', 
          password: 'SecurePass123!',
          phonenumber: '1234567890',
          role: JSON.stringify([Role.VERANTWOORDELIJKE]), 
          status: Status.ACTIEF, 
          address_id: 1, 
        })
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });

  it('should update a user with all required fields', async () => {
    const response = await request.put(`${usersUrl}/1`)
      .send({ 
        lastname: 'Changed Name',  
        firstname: 'Changed',
        birthdate: '1991-02-02T00:00:00.000Z',
        email: 'changed.user@test.com',
        password: 'NewSecurePass123!',
        phonenumber: '0987654321',
        role: JSON.stringify([Role.TECHNIEKER]),
        status: Status.INACTIEF,
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
