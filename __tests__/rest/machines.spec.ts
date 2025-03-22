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

    await prisma.product.create({
      data: {
        id: 1,
        naam: 'Test Product',
        product_informatie: 'Test product informatie',
      },
    });

    createdMachine = await prisma.machine.create({
      data: {
        code: 'MACHINE123',
        locatie: 'Test Location',
        status: Machine_Status.DRAAIT,
        productie_status: Productie_Status.GEZOND,
        site_id: 1,
        product_id: 1,
        technieker_id: 1,
        aantal_goede_producten: 596,
        status_sinds: '2025-03-11T08:36:39.975Z',
        aantal_slechte_producten: 678,
        limiet_voor_onderhoud: 21407,
      },
    });

    const createdKPI = await prisma.kPI.create({
      data: {
        onderwerp: 'Productie Efficiëntie',
        roles: {
          admin: true,
          user: false,
        },
        grafiek: 'LINE',
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
      status: Machine_Status.MANUEEL_GESTOPT,
      productie_status: Productie_Status.GEZOND,
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
      status: Machine_Status.MANUEEL_GESTOPT,
      productie_status: Productie_Status.GEZOND,
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
      status: Machine_Status.MANUEEL_GESTOPT,
      productie_status: Productie_Status.GEZOND,
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
    jest.spyOn(prisma.machine, 'findMany').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request.get(url).set('Authorization', adminAuthHeader);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Database error');
  });
});
