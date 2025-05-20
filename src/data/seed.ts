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
      time: faker.date.recent(),
      message: faker.lorem.sentence(),
      isread: faker.datatype.boolean(),
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
    grafiek: Grafiek.GEZONDHEID,
  };

  const MNGR_KPI_2 = {
    onderwerp: 'Algemene gezondheid site x',
    roles: Rol.MANAGER,
    grafiek: Grafiek.SITES,
  };

  const MNGR_KPI_3 = {
    onderwerp: 'Productiegraad alle sites gesorteerd (hoog naar laag)',
    roles: Rol.MANAGER,
    grafiek: Grafiek.BARHOOGLAAG,
  };

  const MNGR_KPI_4 = {
    onderwerp: 'Productiegraad alle sites gesorteerd (laag naar hoog)',
    roles: Rol.MANAGER,
    grafiek: Grafiek.BARLAAGHOOG,
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
    grafiek: Grafiek.AANKOND,
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
    grafiek: Grafiek.MACHLIST,
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
      street: String(faker.location.street()),
      number: String(faker.location.buildingNumber()),
      city: String(faker.location.city()),
      postalcode: String(faker.location.countryCode('numeric')),
      land: String(faker.location.country()),
    });
  }
  return adressen;
}

async function seedGebruikers(aantal: number) {
  const gebruikers: any = [];
  const bestaandeAdressen: any = await prisma.adres.findMany();
  const robert = {
    address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    lastname: 'Devree',
    firstname: 'Robert',
    birthdate: faker.date.birthdate(),
    email: 'robert.devree@hotmail.com',
    password: await hashPassword('123456789'),
    phonenumber: String(faker.phone.number()),
    role: Rol.MANAGER,
    status: Status.ACTIEF,
  };
  const alice = {
    address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    firstname: 'Alice',
    lastname: 'Johnson',
    birthdate: faker.date.birthdate(),
    email: 'alice.admin@example.com',
    password: await hashPassword('123456789'),
    phonenumber: String(faker.phone.number()),
    role: Rol.ADMINISTRATOR,
    status: Status.ACTIEF,
  };
  const bob = {
    address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    lastname: 'Smith',
    firstname: 'Bob',
    birthdate: faker.date.birthdate(),
    email: 'bob.manager@example.com',
    password: await hashPassword('123456789'),
    phonenumber: String(faker.phone.number()),
    role: Rol.MANAGER,
    status: Status.ACTIEF,
  };
  const charlie = {
    address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    lastname: 'Davis',
    firstname: 'Charlie',
    birthdate: faker.date.birthdate(),
    email: 'charlie.verantwoordelijke@example.com',
    password: await hashPassword('123456789'),
    phonenumber: String(faker.phone.number()),
    role: Rol.VERANTWOORDELIJKE,
    status: Status.ACTIEF,
  };
  const david = {
    address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    lastname: 'Williams',
    firstname: 'David',
    birthdate: faker.date.birthdate(),
    email: 'david.technieker@example.com',
    password: await hashPassword('123456789'),
    phonenumber: String(faker.phone.number()),
    role: Rol.TECHNIEKER,
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
      address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
      lastname: String(naam),
      firstname: String(voornaam),
      birthdate: faker.date.birthdate(),
      email: String(faker.internet.email({ firstName: voornaam, lastName: naam })),
      password: wachtwoord,
      phonenumber: String(faker.phone.number()),
      role: String(
        i == 0 ? Rol.ADMINISTRATOR : i % 2 == 0 ? Rol.MANAGER : i % 3 == 0 ? Rol.TECHNIEKER : Rol.VERANTWOORDELIJKE,
      ),
      status: i == 1 ? Status.INACTIEF : Status.ACTIEF,
    });
  }
  return gebruikers;
}

async function seedSites(aantal: number) {
  const sites: any = [];
  const bestaandeAdressen: any = await prisma.adres.findMany();
  const bestaandeGebruikers: any = await prisma.gebruiker.findMany({
    where: {
      role: {
        equals: Rol.VERANTWOORDELIJKE,
      },
    },
  });
  for (let i = 0; i < aantal; i++) {
    sites.push({
      sitename: String(faker.company.name()),
      verantwoordelijke_id:
        Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
      status: Status.ACTIEF,
      address_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
    });
  }
  return sites;
}

async function seedMachines(aantal: number) {
  const machines: any = [];
  const bestaandeSites: any = await prisma.site.findMany();
  const bestaandeTechniekers: any = await prisma.gebruiker.findMany({
    where: {
      role: {
        equals: Rol.TECHNIEKER,
      },
    },
  });
  for (let i = 0; i < aantal; i++) {
    const aantal_goede_producten = faker.number.int({ min: 0, max: 1000 });
    const aantal_slechte_producten = faker.number.int({ min: 0, max: 1000 });
    const limiet_voor_onderhoud = faker.number.int({ min: 500, max: 20000 });

    // hulp-constanten
    const totaal_producten: number = aantal_goede_producten + aantal_slechte_producten;
    const productie_graad: number = aantal_goede_producten / totaal_producten;
    let productionstatus: Productie_Status = Productie_Status.GEZOND;
    let machinestatus: Machine_Status =
      [
        Machine_Status.DRAAIT,
        Machine_Status.MANUEEL_GESTOPT,
        Machine_Status.IN_ONDERHOUD,
        Machine_Status.STARTBAAR][Math.floor(Math.random() * 4)] as Machine_Status;

    // Als het limit heeft overschreden, dan is het status altijd nood_onderhoud
    // productie_graad van boven 49% is gezond
    if (totaal_producten > limiet_voor_onderhoud || totaal_producten >= limiet_voor_onderhoud) {
      productionstatus = Productie_Status.NOOD_ONDERHOUD;
      machinestatus = Machine_Status.AUTOMATISCH_GESTOPT;
    } else if (productie_graad > 0.50) {
      productionstatus = Productie_Status.FALEND;
    }

    machines.push({
      lastmaintenance: faker.date.past({ years: 0.5 }), // elke 6 maanden automatisch stop voor onderhoud
      site_id: Number(bestaandeSites[Math.floor(Math.random() * bestaandeSites.length)].id),
      futuremaintenance: faker.date.future(),
      product_naam: String(faker.commerce.product()),
      productinfo: String(faker.commerce.productDescription()),
      technician_id:
        Number(bestaandeTechniekers[Math.floor(Math.random() * bestaandeTechniekers.length)].id),
      code: String(faker.commerce.isbn()),
      location: String(faker.location.street()),
      machinestatus,
      productionstatus,
      aantal_goede_producten,
      aantal_slechte_producten,
      limiet_voor_onderhoud,
    });
  }
  return machines;
}

async function seedOnderhouden(aantal: number) {
  const onderhouden: any = [];
  const bestaandeMachines: any = await prisma.machine.findMany();
  const bestaandeGebruikers: any = await prisma.gebruiker.findMany({
    where: {
      role: {
        equals: Rol.TECHNIEKER,
      },
    },
  });
  for (let i = 0; i < aantal; i++) {
    onderhouden.push({
      machine_id: Number(bestaandeMachines[Math.floor(Math.random() * bestaandeMachines.length)].id),
      technician_id:
        Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
      executiondate: faker.date.anytime(),
      startdate: faker.date.past(),
      enddate: faker.date.future(),
      reason: faker.lorem.sentence(),
      status: Object.values(Onderhoud_Status)[Math.floor(Math.random() * Object.values(Onderhoud_Status).length)],
      comments: faker.lorem.sentence(),
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