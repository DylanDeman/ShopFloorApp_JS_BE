import supertest from 'supertest';
import { prisma } from '../../src/data';
import createServer from '../../src/createServer'; 
import type { Server } from '../../src/createServer'; 
import Role from '../../src/core/roles';
import { Machine_Status, Status, Productie_Status } from '@prisma/client'; // Import the correct enum

jest.setTimeout(20000); 

const dataToDelete = {
  sites: [1],
  users: [1, 2],
  addresses: [1, 2],
  machines: [1],
  products: [1],
};

const data = {
  users: [
    {
      id: 1,
      naam: 'Test User',
      voornaam: 'Test',
      geboortedatum: new Date(1990, 1, 1),
      email: 'user@test.com',
      wachtwoord: 'UUBE4UcWvSZNaIw',
      gsm: '1234567890',
      rol: [Role.VERANTWOORDELIJKE],
      status: Status.ACTIEF,
      adres_id: 1,
    },
    {
      id: 2,
      naam: 'Test Admin',
      voornaam: 'Admin',
      geboortedatum: new Date(1985, 5, 5),
      email: 'admin@test.com',
      wachtwoord: 'UUBE4UcWvSZNaIw',
      gsm: '1234567890',
      rol: [Role.MANAGER, Role.ADMINISTRATOR],
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
  products: [
    {
      id: 1,
      naam: 'Test Product',
    },
  ],
  machines: [
    {
      id: 1,
      locatie: 'Lijn 1',
      status: Machine_Status.DRAAIT, // Correct enum usage
      productie_status: Productie_Status.GEZOND, // Correct enum usage
      site_id: 1,
      product_id: 1,
      technieker_gebruiker_id: 1,
      code: 'MCH-001',
    },
  ],
};

describe('Sites API', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/sites';

  describe('GET /api/sites', () => {
    beforeAll(async () => {
      await prisma.adres.createMany({ data: data.addresses });
      await prisma.gebruiker.createMany({ data: data.users });
      await prisma.site.createMany({ data: data.sites });
      await prisma.product.createMany({ data: data.products });
      await prisma.machine.createMany({ data: data.machines });
    });

    afterAll(async () => {
      await prisma.machine.deleteMany({ where: { id: { in: dataToDelete.machines } } });
      await prisma.product.deleteMany({ where: { id: { in: dataToDelete.products } } });
      await prisma.site.deleteMany({ where: { id: { in: dataToDelete.sites } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.users } } });
      await prisma.adres.deleteMany({ where: { id: { in: dataToDelete.addresses } } });
    });

    it('should 200 and return all sites', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
    });
  });

  describe('GET /api/sites/:id', () => {
    beforeAll(async () => {
      await prisma.adres.createMany({ data: data.addresses });
      await prisma.gebruiker.createMany({ data: data.users });
      await prisma.site.createMany({ data: data.sites });
      await prisma.product.createMany({ data: data.products });
      await prisma.machine.createMany({ data: data.machines });
    });

    afterAll(async () => {
      await prisma.machine.deleteMany({ where: { id: { in: dataToDelete.machines } } });
      await prisma.product.deleteMany({ where: { id: { in: dataToDelete.products } } });
      await prisma.site.deleteMany({ where: { id: { in: dataToDelete.sites } } });
      await prisma.gebruiker.deleteMany({ where: { id: { in: dataToDelete.users } } });
      await prisma.adres.deleteMany({ where: { id: { in: dataToDelete.addresses } } });
    });

    it('should 200 and return a site with machines', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.naam).toBe('Test Site');
      expect(response.body.verantwoordelijke).toBe('Test Test User');
      expect(response.body.aantalMachines).toBe(1);
      expect(response.body.machines.length).toBe(1);
      expect(response.body.machines[0].locatie).toBe('Lijn 1');
      expect(response.body.machines[0].status).toBe(Machine_Status.DRAAIT);
      expect(response.body.machines[0].Productie_Status).toBe(Productie_Status.GEZOND);
    });
  });

  describe('GET /api/sites/:id (not found)', () => {
    it('should 404 when site is not found', async () => {
      const response = await request.get(`${url}/999`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Site niet gevonden');
    });
  });

  describe('GET /api/sites/ (empty database)', () => {
    it('should 404 when there are no sites', async () => {
      await prisma.machine.deleteMany({});
      await prisma.product.deleteMany({});
      await prisma.site.deleteMany({});
      await prisma.gebruiker.deleteMany({});
      await prisma.adres.deleteMany({});
      
      const response = await request.get(url);
      expect(response.status).toBe(404); 
      expect(response.body.message).toBe('Geen sites gevonden.');
    });
  });

});
// TODO: Create update and delete tests