import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { prisma } from '../../src/data';
import { Status } from '@prisma/client';
import { Machine_Status, Productie_Status } from '@prisma/client';
import Role from '../../src/core/roles';
import { loginAdmin } from '../helpers/login';

jest.setTimeout(20000);

describe('Machines API', () => {
  let request: supertest.Agent;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/machines';
  beforeAll(async () => {
    // Cleanup existing data
    await prisma.machine.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});

    // Create necessary records

    // Create an address
    await prisma.adres.createMany({
      data: [
        { id: 1, straat: 'Teststraat', huisnummer: '1A', stadsnaam: 'Teststad', postcode: '1234', land: 'Testland' },
      ],
    });

    // Create a user (technieker)
    await prisma.gebruiker.createMany({
      data: [
        { 
          id: 1, 
          naam: 'Test User', 
          voornaam: 'Test', 
          geboortedatum: new Date(1990, 1, 1), 
          email: 'user@test.com',
          wachtwoord: 'password', 
          gsm: '1234567890', 
          rol: Role.VERANTWOORDELIJKE, 
          status: Status.ACTIEF, 
          adres_id: 1, 
        },
      ],
    });

    // Create a site
    await prisma.site.createMany({
      data: [
        { 
          id: 1, 
          naam: 'Test Site', 
          verantwoordelijke_id: 1, 
          status: Status.ACTIEF, 
        },
      ],
    });

    // Create a product
    await prisma.product.create({
      data: { naam: 'Test Product' },
    });

    // Create a machine
    await prisma.machine.create({
      data: {
        code: 'MACHINE123',
        locatie: 'Test Location',
        product_informatie: 'Product info for machine',
        status: Machine_Status.DRAAIT,  // Enum value
        productie_status: Productie_Status.GEZOND,  // Enum value
        site_id: 1,  // Reference to created site
        product_id: 1,  // Reference to created product
        technieker_gebruiker_id: 1,  // Reference to created gebruiker
      },
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.machine.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});
  });

  describe('GET /api/machines', () => {
    it('should return all machines', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/machines/:id', () => {
    it('should return a machine by ID', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.code).toBe('MACHINE123');
    });
  });

  describe('PUT /api/machines/:id', () => {
    it('should update a machine', async () => {
      const updatedMachine = {
        code: 'MACHINE123_UPDATED',
        locatie: 'Updated Location',
        product_informatie: 'Updated product info',
        status: Machine_Status.MANUEEL_GESTOPT,  // Enum value
        productie_status: Productie_Status.NOOD_ONDERHOUD,  // Enum value
        site_id: 1,  // Should match existing site ID
        product_id: 1,  // Should match existing product ID
        technieker_gebruiker_id: 1,  // Should match existing gebruiker ID
      };

      const response = await request.put(`${url}/1`)
        .set('Authorization', adminAuthHeader)
        .send(updatedMachine);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(updatedMachine.code);
      expect(response.body.locatie).toBe(updatedMachine.locatie);
      expect(response.body.status).toBe(updatedMachine.status); // Machine_Status.MANUEEL_GESTOPT
      expect(response.body.productie_status).toBe(updatedMachine.productie_status); // Productie_Status.NOOD_ONDERHOUD
    });
  });
});
