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
        straat: 'Teststraat',
        huisnummer: '1A',
        stadsnaam: 'Teststad',
        postcode: '1234AB',
        land: 'Testland',
      },
    });

    await prisma.gebruiker.createMany({
      data: [
        {
          id: 1,
          naam: 'Test User',
          voornaam: 'Test',
          geboortedatum: new Date(1990, 1, 1),
          email: 'user@test.com',
          wachtwoord: passwordHash,
          gsm: '1234567890',
          rol: JSON.stringify([Role.VERANTWOORDELIJKE]),
          status: Status.ACTIEF,
          adres_id: 1,
        },
        {
          id: 2,
          naam: 'Test Admin',
          voornaam: 'admin',
          geboortedatum: new Date(1990, 1, 1),
          email: 'admin@test.com',
          wachtwoord: passwordHash,
          gsm: '1234567890',
          rol: JSON.stringify([Role.MANAGER, Role.ADMINISTRATOR, Role.VERANTWOORDELIJKE]),
          status: Status.ACTIEF,
          adres_id: 1,
        },
      ],
    });

    await prisma.site.create({
      data: {
        id: 1,
        naam: 'Test Site',
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
