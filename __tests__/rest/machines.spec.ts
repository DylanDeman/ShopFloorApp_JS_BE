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
  
  let createdMachine: any; 

  beforeAll(async () => {
    await prisma.notificatie.deleteMany({});
    await prisma.kPIWaarde.deleteMany({});
    await prisma.kPI.deleteMany({});
    // await prisma.product.deleteMany({});
    await prisma.machine.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});

    await prisma.adres.create({
      data: {
        id: 1,
        straat: 'Teststraat',
        huisnummer: '1A',
        stadsnaam: 'Teststad',
        postcode: '1234',
        land: 'Testland',
      },
    });

    await prisma.gebruiker.create({
      data: {
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
    });

    await prisma.site.create({
      data: {
        id: 1,
        naam: 'Test Site',
        verantwoordelijke_id: 1,
        status: Status.ACTIEF,
      },
    });

    const createdProduct = await prisma.product.create({
      data: {
        naam: 'Test Product',
      },
    });

    createdMachine = await prisma.machine.create({
      data: {
        code: 'MACHINE123',
        locatie: 'Test Location',
        product_informatie: 'Product info for machine',
        status: Machine_Status.DRAAIT,
        productie_status: Productie_Status.GEZOND,
        site_id: 1,
        product_id: createdProduct.id,
        technieker_gebruiker_id: 1,
      },
    });

    const createdKPI = await prisma.kPI.create({
      data: {
        onderwerp: 'Productie Efficiëntie',
        roles: {
          admin: true,
          user: false,
        },
        grafiek: 'BAR',
      },
    });
   
    await prisma.kPIWaarde.create({
      data: {
        datum: new Date(),
        waarde: { score: 90 }, 
        site_id: '1',
        kpi_id: createdKPI.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.kPIWaarde.deleteMany({});
    await prisma.kPI.deleteMany({});
    await prisma.product.deleteMany({});
  });

  // Use `createdMachine.id` dynamically
  it('should return a machine by ID', async () => {
    const response = await request.get(`${url}/${createdMachine.id}`).set('Authorization', adminAuthHeader);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdMachine.id);
    expect(response.body.code).toBe('MACHINE123');
  });

  describe('GET /api/machines', () => {
    it('should return all machines', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/machines/:id', () => {
    it('should update a machine', async () => {
      const updatedMachine = {
        code: 'MACHINE123',
        locatie: 'Test Location',
        status: Machine_Status.MANUEEL_GESTOPT,
        productie_status: Productie_Status.GEZOND,
        site_id: 1,
        product_id: 1,
        technieker_gebruiker_id: 1,
      };
  
      // Use `createdMachine.id` dynamically in the request URL
      const response = await request.put(`${url}/${createdMachine.id}`)
        .set('Authorization', adminAuthHeader)
        .send(updatedMachine);
  
      expect(response.status).toBe(200);  
      expect(response.body.code).toBe(updatedMachine.code);  
      expect(response.body.locatie).toBe(updatedMachine.locatie);  
      expect(response.body.status).toBe(updatedMachine.status);  
      expect(response.body.productie_status).toBe(updatedMachine.productie_status);  
    });
  });
});
