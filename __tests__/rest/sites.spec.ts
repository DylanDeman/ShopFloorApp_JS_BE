import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { prisma } from '../../src/data';
import Role from '../../src/core/roles';
import { Status, Machine_Status, Productie_Status } from '@prisma/client';
import { loginAdmin } from '../helpers/login';

jest.setTimeout(20000);

describe('Sites API', () => {
  let request: supertest.Agent;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    adminAuthHeader = await loginAdmin(request);

    await prisma.machine.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.machine.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});

    await prisma.adres.createMany({
      data: [
        { id: 1, straat: 'Teststraat', huisnummer: '1A', stadsnaam: 'Teststad', postcode: '1234', land: 'Testland' },
      ],
    });
    await prisma.gebruiker.createMany({
      data: [
        { id: 1, naam: 'Test User', voornaam: 'Test', geboortedatum: new Date(1990, 1, 1), email: 'user@test.com',
          wachtwoord: 'password', gsm: '1234567890', rol: Role.VERANTWOORDELIJKE, 
          status: Status.ACTIEF, adres_id: 1 },
      ],
    });
    await prisma.site.createMany({
      data: [{ id: 1, naam: 'Test Site', verantwoordelijke_id: 1, status: Status.ACTIEF }],
    });
    
    await prisma.machine.create({
      data: {
        id: 1,
        code: 'MACHINE123',
        locatie: 'Test Location',
        status: Machine_Status.DRAAIT,
        productie_status: Productie_Status.GEZOND,
        site_id: 1,
        product_naam: 'USB sticks',
        product_informatie: '64 GB',
        technieker_id: 1,
        status_sinds: '2025-03-11T08:36:39.975Z',
        aantal_goede_producten: 568,
        aantal_slechte_producten: 890,
        limiet_voor_onderhoud: 21000,
      },
    });
  });

  afterAll(async () => {
    await prisma.machine.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});
  });

  const url = '/api/sites';

  const newSite = {
    naam: 'New Site',
    verantwoordelijke_id: 1,
    status: Status.ACTIEF,
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
      const updateData = { naam: 'Updated Site', verantwoordelijke_id: 1 , status: 'ACTIEF' };
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
