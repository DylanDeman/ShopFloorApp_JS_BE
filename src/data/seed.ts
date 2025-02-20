import { PrismaClient, Status, Machine_Status, Productie_Status, Onderhoud_Status } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Rol from '../core/roles';

const prisma = new PrismaClient();

async function main () {
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
}

async function seedAdressen(aantal: number) {
  const adressen: any = [];
  for(let i = 0; i < aantal; i++){
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
  for(let i = 0; i < aantal; i++){
    const naam = faker.person.lastName();
    const voornaam = faker.person.firstName();
    gebruikers.push({
      adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
      naam: String(naam),
      voornaam: String(voornaam),
      geboortedatum: faker.date.birthdate(),
      email: String(faker.internet.email({firstName: voornaam, lastName: naam})),
      wachtwoord: String(faker.internet.password()),
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
    }});
  for(let i = 0; i < aantal; i ++){
    sites.push({
      naam: String(faker.company.name()),
      verantwoordelijke_id: 
        Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
    });
  }
  return sites;
}

async function seedProducten(aantal: number) {
  const producten: any = [];
  for(let i = 0; i < aantal; i ++){
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
    }});
  for(let i = 0; i < aantal; i ++){
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
  for(let i = 0; i < aantal; i ++){
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