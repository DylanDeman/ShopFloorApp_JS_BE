import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import { hashPassword } from '../../src/core/password';
import Role from '../../src/core/roles';
import Status from '../../src/core/status'; 

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    const passwordHash = await hashPassword('password123');

    await prisma.adres.createMany({
      data: [
        {
          id: 1,
          straat: 'Teststraat',
          huisnummer: '1A',
          stadsnaam: 'Teststad',
          postcode: '1234',
          land: 'Testland',
        },
      ],
    });

    await prisma.gebruiker.createMany({
      data: [
        {
          id: 1,
          naam: 'Test User',
          voornaam: 'Test',
          geboortedatum: new Date(1990, 1, 1),
          email: 'test@example.com',
          wachtwoord: passwordHash,
          gsm: '1234567890',
          rol: JSON.stringify([Role.VERANTWOORDELIJKE]), 
          status: Status.ACTIEF, 
          adres_id: 1,
        },
      ],
    });

    await prisma.site.createMany({
      data: [
        {
          id: 1,
          naam: 'Test Site',
          verantwoordelijke_id: 1,
        },
      ],
    });

    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await prisma.site.deleteMany({ where: { id: { in: [1] } } });
    await prisma.gebruiker.deleteMany({ where: { id: { in: [1] } } });
    await prisma.adres.deleteMany({ where: { id: { in: [1] } } });

    await server.stop();
  });
}
