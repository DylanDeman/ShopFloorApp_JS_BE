import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { prisma } from '../../src/data';
import Role from '../../src/core/roles';
import { Status, Onderhoud_Status } from '@prisma/client';
import { loginAdmin } from '../helpers/login';

jest.setTimeout(20000);

describe('Onderhoud API', () => {
  let request: supertest.Agent;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    adminAuthHeader = await loginAdmin(request);
    await prisma.notificatie.deleteMany({});
    await prisma.onderhoud.deleteMany({});
    await prisma.kPIWaarde.deleteMany({});
    await prisma.kPI.deleteMany({});
    await prisma.machine.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});   

    await prisma.adres.create({
      data: {
        id: 1,
        street: 'Onderhoudstraat',
        number: '10B',
        city: 'Onderhoudstad',
        postalcode: '4321',
        land: 'Onderhoudland',
      },
    });

    await prisma.gebruiker.create({
      data: {
        id: 1,
        lastname: 'Onderhoud Technieker',
        firstname: 'Technieker',
        birthdate: new Date(1990, 5, 15),
        email: 'technieker@onderhoud.com',
        password: 'password123',
        phonenumber: '9876543210',
        role: Role.TECHNIEKER,
        status: Status.ACTIEF,
        address_id: 1,
      },
    });
    
    await prisma.site.create({
      data: {
        id: 1,
        sitename: 'Test Site',
        verantwoordelijke_id: 1,
        status: Status.ACTIEF,
      },
    });

    await prisma.machine.create({
      data: {
        id: 1,
        code: 'MACHINE456',
        location: 'Onderhoud Location',
        machinestatus: 'DRAAIT',
        productionstatus: 'GEZOND',
        lastmaintenance: new Date('2025-03-11T08:36:39.975Z'),
        aantal_goede_producten: 1000,
        aantal_slechte_producten: 50,
        limiet_voor_onderhoud: 5000,
        technician_id: 1,
        site_id: 1,
        product_naam: 'RAM DDR4',
        productinfo: '16GB',
      },
    });

    await prisma.onderhoud.create({
      data: {
        id: 1,
        machine_id: 1,
        technician_id: 1,
        executiondate: new Date(),
        startdate: new Date(),
        enddate: new Date(),
        reason: 'Preventief onderhoud',
        status: Onderhoud_Status.IN_UITVOERING,
        comments: 'Alles gaat goed',
      },
    });
  });

  afterAll(async () => {

    await prisma.kPIWaarde.deleteMany({});
    await prisma.kPI.deleteMany({});
    await prisma.onderhoud.deleteMany({});  
    await prisma.notificatie.deleteMany({}); 
    await prisma.machine.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});
  });

  const url = '/api/onderhouden';

  const newOnderhoud = {
    machine_id: 1,
    technician_id: 1,
    executiondate: new Date(),
    startdate: new Date(),
    enddate: new Date(),
    reason: 'Nieuw onderhoud',
    status: Onderhoud_Status.INGEPLAND,
    comments: 'Planning for new maintenance',
  };

  describe('GET /api/onderhouden', () => {
    it('should return all onderhoud', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
    });
  });

  describe('POST /api/onderhouden', () => {
    it('should create a new onderhoud', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader).send(newOnderhoud);
      expect(response.status).toBe(201);
      expect(response.body.reason).toBe(newOnderhoud.reason);
    });
  });

  describe('GET /api/onderhouden/:id', () => {
    it('should return an onderhoud by ID', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });
  });

  describe('PUT /api/onderhouden/:id', () => {
    it('should update an onderhoud', async () => {
      const updateData = { reason: 'Updated Onderhoud', status: Onderhoud_Status.VOLTOOID, machine_id: 1, technician_id:
         1, executiondate: new Date(), startdate: new Date(), enddate: new Date(), comments: 'Updated onderhoud' };
      const response = await request.put(`${url}/1`).set('Authorization', adminAuthHeader).send(updateData);
      expect(response.status).toBe(200);
      expect(response.body.reason).toBe(updateData.reason);
    });
  });

  describe('DELETE /api/onderhouden/:id', () => {
    it('should delete an onderhoud', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(204);
    });
  });
});
