import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import { hashPassword } from '../../src/core/password';
import Role from '../../src/core/roles';
import { Status } from '@prisma/client';

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    await prisma.notificatie.deleteMany({});  
    await prisma.machine.deleteMany({});
    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});

    const passwordHash = await hashPassword('UUBE4UcWvSZNaIw');

    await prisma.adres.create({
      data: {
        id: 1,
        street: 'Teststraat',
        number: '1A',
        city: 'Teststad',
        postalcode: '1234AB',
        land: 'Testland',
      },
    });

    await prisma.gebruiker.createMany({
      data: [
        {
          id: 1,
          lastname: 'Test User',
          firstname: 'Test',
          birthdate: new Date(1990, 1, 1),
          email: 'user@test.com',
          password: passwordHash,
          phonenumber: '1234567890',
          role: JSON.stringify([Role.VERANTWOORDELIJKE]),
          status: Status.ACTIEF,
          address_id: 1,
        },
        {
          id: 2,
          lastname: 'Test Admin',
          firstname: 'admin',
          birthdate: new Date(1990, 1, 1),
          email: 'admin@test.com',
          password: passwordHash,
          phonenumber: '1234567890',
          role: JSON.stringify([Role.MANAGER, Role.ADMINISTRATOR, Role.VERANTWOORDELIJKE]),
          status: Status.ACTIEF,
          address_id: 1,
        },
      ],
    });

    await prisma.site.create({
      data: {
        id: 1,
        sitename: 'Test Site',
        verantwoordelijke_id: 2, 
        status: Status.ACTIEF,
      },
    });

    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {

    await prisma.notificatie.deleteMany({});
    await prisma.onderhoud.deleteMany({});  

    await prisma.machine.deleteMany({});

    await prisma.site.deleteMany({});
    await prisma.gebruiker.deleteMany({});
    await prisma.adres.deleteMany({});

    await server.stop();
  });

}
