import type supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login, loginAdmin } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';
import Role from '../../src/core/roles'; 
import Status from '../../src/core/status'; 

const data = {
  users: [
    {
      id: 1,
      naam: 'Test User',
      voornaam: 'Test',
      geboortedatum: new Date(1990, 1, 1),
      email: 'test@example.com',
      wachtwoord: 'password123',
      gsm: '1234567890',
      rol: [Role.VERANTWOORDELIJKE], 
      status: Status.ACTIEF, 
      adres_id: 1,
    },
    {
      id: 2,
      naam: 'Admin User',
      voornaam: 'Admin',
      geboortedatum: new Date(1985, 5, 5),
      email: 'admin@example.com',
      wachtwoord: 'password123',
      gsm: '0987654321',
      rol: [Role.ADMINISTRATOR, Role.MANAGER], 
      status: Status.ACTIEF, 
      adres_id: 2,
    },
  ],
  addresses: [
    {
      id: 1,
      straat: 'Teststraat',
      huisnummer: '1A',
      stadsnaam: 'Teststad',
      postcode: '1234',
      land: 'Testland',
    },
    {
      id: 2,
      straat: 'Adminstraat',
      huisnummer: '2B',
      stadsnaam: 'Adminstad',
      postcode: '5678',
      land: 'Adminland',
    },
  ],
  sites: [
    {
      id: 1,
      naam: 'Test Site',
      verantwoordelijke_id: 1,
    },
  ],
};

const dataToDelete = {
  sites: [1],
  users: [1, 2],
  addresses: [1, 2],
};

describe('Sites API', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/sites';

  describe('GET /api/sites', () => {
    beforeAll(async () => {
      await prisma.adres.createMany({ data: data.addresses });
      await prisma.gebruiker.createMany({ data: data.users });
      await prisma.site.createMany({ data: data.sites });
    });

    afterAll(async () => {
      await prisma.site.deleteMany({ where: { id: { in: dataToDelete.sites } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.users } } });
      await prisma.adres.deleteMany({ where: { id: { in: dataToDelete.addresses } } });
    });

    it('should 200 and return all sites', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            naam: 'Test Site',
            verantwoordelijke: { id: 1, naam: 'Test User' },
          },
        ]),
      );
    });
  });

  describe('GET /api/sites/:id', () => {
    it('should return a specific site', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        naam: 'Test Site',
        verantwoordelijke: { id: 1, naam: 'Test User' },
      });
    });
  });

  describe('POST /api/sites', () => {
    it('should create a new site if user is ADMINISTRATOR or MANAGER', async () => {
      const response = await request
        .post(url)
        .send({
          naam: 'New Site',
          verantwoordelijke_id: 1,
        })
        .set('Authorization', adminAuthHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe('New Site');
    });
  });

  describe('DELETE /api/sites/:id', () => {
    it('should delete a site if user is ADMINISTRATOR', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
    });
  });

  testAuthHeader(() => request.get(url));
});
