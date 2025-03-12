import { PrismaClient, Grafiek, Status, Machine_Status, Productie_Status, Onderhoud_Status } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Rol from '../core/roles';
import { hashPassword } from '../core/password';

const prisma = new PrismaClient();

async function main() {
  await prisma.adres.createMany({
    data: await seedAdressen(100),
  });
  await prisma.gebruiker.createMany({
    data: await seedGebruikers(100),
  });
  await prisma.site.createMany({
    data: await seedSites(100),
  });
  await prisma.product.createMany({
    data: await seedProducten(100),
  });
  await prisma.machine.createMany({
    data: await seedMachines(100),
  });
  await prisma.onderhoud.createMany({
    data: await seedOnderhouden(100),
  });
  await prisma.kPI.createMany({
    data: await seedKPIs(),
  });
  // await prisma.kPIWaarde.createMany({
  //   data: await seedKPIWaarden(100),
  // });
  // await prisma.dashboard.createMany({
  //   data: await seedDashboards(10),
  // });
  await prisma.notificatie.createMany({
    data: await seedNotificaties(20),
  });
}

// async function seedKPIWaarden(aantal: number) {
//   const KPIWaarden: any = [];
//   const bestaandeKPIs = await prisma.kPI.findMany();

//   for (let i = 0; i < aantal; i++) {
//     KPIWaarden.push({
//       datum: faker.date.past(),
//       waarde: faker.number.int({ min: 0, max: 1000 }),
//       kpi_id: bestaandeKPIs[Math.floor(Math.random() * bestaandeKPIs.length)].id,
//     });
//   }
//   return KPIWaarden;
// }

async function seedNotificaties(aantal: number) {
  const notificaties: any = [];
  for (let i = 0; i < aantal; i++) {
    notificaties.push({
      tijdstip: faker.date.recent(),
      bericht: faker.lorem.sentence(),
      gelezen: faker.datatype.boolean(),
    });
  }
  return notificaties;
}

// async function seedDashboards(aantal: number) {
//   const dashboards: any = [];

//   const bestaandeKPIs = await prisma.kPI.findMany();
//   const bestaandeGebruikers: any = await prisma.gebruiker.findMany();

//   for (let i = 0; i < aantal; i++) {
//     dashboards.push({
//       gebruiker_id: bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id,
//       kpi_id: bestaandeKPIs[Math.floor(Math.random() * bestaandeKPIs.length)].id,
//     });
//   }

//   return dashboards;
// }

async function seedKPIs() {
  const KPIs: any = [];

  const MNGR_KPI_1 = {
    onderwerp: 'Algemene gezondheid alle sites',
    roles: Rol.MANAGER,
    grafiek: Grafiek.SINGLE,
  };

  const MNGR_KPI_2 = {
    onderwerp: 'Algemene gezondheid site x',
    roles: Rol.MANAGER,
    grafiek: Grafiek.SITES,
  };

  const MNGR_KPI_3 = {
    onderwerp: 'Productiegraad alle sites gesorteerd (hoog naar laag)',
    roles: Rol.MANAGER,
    grafiek: Grafiek.BAR,
  };

  const MNGR_KPI_4 = {
    onderwerp: 'Productiegraad alle sites gesorteerd (laag naar hoog)',
    roles: Rol.MANAGER,
    grafiek: Grafiek.BAR,
  };

  KPIs.push(MNGR_KPI_1, MNGR_KPI_2, MNGR_KPI_3, MNGR_KPI_4);

  const VW_KPI_1 = {
    onderwerp: 'Top 5 gezonde machines',
    roles: Rol.VERANTWOORDELIJKE,
    grafiek: Grafiek.TOP5,
  };

  const VW_KPI_2 = {
    onderwerp: 'Top 5 falende machines',
    roles: Rol.VERANTWOORDELIJKE,
    grafiek: Grafiek.TOP5,
  };

  const VW_KPI_3 = {
    onderwerp: 'Top 5 machines met nood aan onderhoud',
    roles: Rol.VERANTWOORDELIJKE,
    grafiek: Grafiek.TOP5,
  };

  KPIs.push(VW_KPI_1, VW_KPI_2, VW_KPI_3);

  const TECH_KPI_1 = {
    onderwerp: 'Aankomende onderhoudsbeurten',
    roles: Rol.TECHNIEKER,
    grafiek: Grafiek.TOP5OND,
  };

  const TECH_KPI_2 = {
    onderwerp: 'Laatste 5 onderhoudsbeurten',
    roles: Rol.TECHNIEKER,
    grafiek: Grafiek.TOP5OND,
  };

  KPIs.push(TECH_KPI_1, TECH_KPI_2);

  const VW_TECH_KPI_1 = {
    onderwerp: 'Draaiende machines',
    roles: [Rol.VERANTWOORDELIJKE, Rol.TECHNIEKER],
    grafiek: Grafiek.SINGLE,
  };

  const VW_TECH_KPI_2 = {
    onderwerp: 'Manueel gestopte machines',
    roles: [Rol.VERANTWOORDELIJKE, Rol.TECHNIEKER],
    grafiek: Grafiek.SINGLE,
  };

  const VW_TECH_KPI_3 = {
    onderwerp: 'Automatisch gestopte machines',
    roles: [Rol.VERANTWOORDELIJKE, Rol.TECHNIEKER],
    grafiek: Grafiek.SINGLE,
  };

  const VW_TECH_KPI_4 = {
    onderwerp: 'Machines in onderhoud',
    roles: [Rol.VERANTWOORDELIJKE, Rol.TECHNIEKER],
    grafiek: Grafiek.SINGLE,
  };

  const VW_TECH_KPI_5 = {
    onderwerp: 'Startbare machines',
    roles: [Rol.VERANTWOORDELIJKE, Rol.TECHNIEKER],
    grafiek: Grafiek.SINGLE,
  };

  const VW_TECH_KPI_6 = {
    onderwerp: 'Mijn machines',
    roles: [Rol.VERANTWOORDELIJKE, Rol.TECHNIEKER],
    grafiek: Grafiek.LIST,
  };

  KPIs.push(
    VW_TECH_KPI_1,
    VW_TECH_KPI_2,
    VW_TECH_KPI_3,
    VW_TECH_KPI_4,
    VW_TECH_KPI_5,
    VW_TECH_KPI_6,
  );

  return KPIs;
}

async function seedAdressen(aantal: number) {
  const adressen: any = [];
  for (let i = 0; i < aantal; i++) {
    adressen.push({
      straat: String(faker.location.street()),
      huisnummer: String(faker.location.buildingNumber()),
      stadsnaam: String(faker.location.city()),
      postcode: String(faker.location.zipCode()),
      land: String(faker.location.country()),
    });
  }
  return adressen;
}

async function seedGebruikers(aantal: number) {
  const gebruikers: any = [];
  const bestaandeAdressen: any = await prisma.adres.findMany();
  const robert = {
    adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    naam: 'Devree',
    voornaam: 'Robert',
    geboortedatum: faker.date.birthdate(),
    email: 'robert.devree@hotmail.com',
    wachtwoord: await hashPassword('123456789'),
    gsm: String(faker.phone.number()),
    rol: Rol.MANAGER,
    status: Status.ACTIEF,
  };
  const alice = {
    adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    voornaam: 'Alice',
    naam: 'Johnson',
    geboortedatum: faker.date.birthdate(),
    email: 'alice.admin@example.com',
    wachtwoord: await hashPassword('123456789'),
    gsm: String(faker.phone.number()),
    rol: Rol.ADMINISTRATOR,
    status: Status.ACTIEF,
  };
  const bob = {
    adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    naam: 'Smith',
    voornaam: 'Bob',
    geboortedatum: faker.date.birthdate(),
    email: 'bob.manager@example.com',
    wachtwoord: await hashPassword('123456789'),
    gsm: String(faker.phone.number()),
    rol: Rol.MANAGER,
    status: Status.ACTIEF,
  };
  const charlie = {
    adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    naam: 'Davis',
    voornaam: 'Charlie',
    geboortedatum: faker.date.birthdate(),
    email: 'charlie.verantwoordelijke@example.com',
    wachtwoord: await hashPassword('123456789'),
    gsm: String(faker.phone.number()),
    rol: Rol.VERANTWOORDELIJKE,
    status: Status.ACTIEF,
  };
  const david = {
    adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    naam: 'Williams',
    voornaam: 'David',
    geboortedatum: faker.date.birthdate(),
    email: 'david.technieker@example.com',
    wachtwoord: await hashPassword('123456789'),
    gsm: String(faker.phone.number()),
    rol: Rol.TECHNIEKER,
    status: Status.ACTIEF,
  };

  gebruikers.push(robert);
  gebruikers.push(alice);
  gebruikers.push(bob);
  gebruikers.push(charlie);
  gebruikers.push(david);

  for (let i = 0; i < aantal; i++) {
    const naam = faker.person.lastName();
    const voornaam = faker.person.firstName();
    const wachtwoord = await hashPassword('123456789');
    gebruikers.push({
      adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
      naam: String(naam),
      voornaam: String(voornaam),
      geboortedatum: faker.date.birthdate(),
      email: String(faker.internet.email({ firstName: voornaam, lastName: naam })),
      wachtwoord: wachtwoord,
      gsm: String(faker.phone.number()),
      rol: String(
        i == 0 ? Rol.ADMINISTRATOR : i % 2 == 0 ? Rol.MANAGER : i % 3 == 0 ? Rol.TECHNIEKER : Rol.VERANTWOORDELIJKE,
      ),
      status: i == 1 ? Status.INACTIEF : Status.ACTIEF,
    });
  }
  return gebruikers;
}

async function seedSites(aantal: number) {
  const sites: any = [];
  const bestaandeGebruikers: any = await prisma.gebruiker.findMany({
    where: {
      rol: {
        equals: Rol.VERANTWOORDELIJKE,
      },
    },
  });
  for (let i = 0; i < aantal; i++) {
    sites.push({
      naam: String(faker.company.name()),
      verantwoordelijke_id:
        Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
      status: Status.ACTIEF,
    });
  }
  return sites;
}

async function seedProducten(aantal: number) {
  const producten: any = [];
  for (let i = 0; i < aantal; i++) {
    producten.push({
      naam: faker.commerce.product(),
    });
  }
  return producten;
}

async function seedMachines(aantal: number) {
  const machines: any = [];
  const bestaandeSites: any = await prisma.site.findMany();
  const bestaansdeProducten: any = await prisma.product.findMany();
  const bestaandeGebruikers: any = await prisma.gebruiker.findMany({
    where: {
      rol: {
        equals: Rol.TECHNIEKER,
      },
    },
  });
  for (let i = 0; i < aantal; i++) {
    machines.push({
      site_id: Number(bestaandeSites[Math.floor(Math.random() * bestaandeSites.length)].id),
      product_id: Number(bestaansdeProducten[Math.floor(Math.random() * bestaansdeProducten.length)].id),
      technieker_gebruiker_id:
        Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
      code: String(faker.commerce.isbn()),
      locatie: String(faker.location.street()),
      status: Object.values(Machine_Status)[Math.floor(Math.random() * Object.values(Machine_Status).length)],
      productie_status:
        Object.values(Productie_Status)[Math.floor(Math.random() * Object.values(Productie_Status).length)],
    });
  }
  return machines;
}

async function seedOnderhouden(aantal: number) {
  const onderhouden: any = [];
  const bestaandeMachines: any = await prisma.machine.findMany();
  const bestaandeGebruikers: any = await prisma.gebruiker.findMany({
    where: {
      rol: {
        equals: Rol.TECHNIEKER,
      },
    },
  });
  for (let i = 0; i < aantal; i++) {
    onderhouden.push({
      machine_id: Number(bestaandeMachines[Math.floor(Math.random() * bestaandeMachines.length)].id),
      technieker_gebruiker_id:
        Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
      datum: faker.date.anytime(),
      starttijdstip: faker.date.past(),
      eindtijdstip: faker.date.future(),
      reden: faker.lorem.sentence(),
      status: Object.values(Onderhoud_Status)[Math.floor(Math.random() * Object.values(Onderhoud_Status).length)],
      opmerkingen: faker.lorem.paragraph(),
    });
  }
  return onderhouden;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });