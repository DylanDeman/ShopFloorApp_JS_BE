"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const roles_1 = __importDefault(require("../core/roles"));
const password_1 = require("../core/password");
const prisma = new client_1.PrismaClient();
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
    await prisma.notificatie.createMany({
        data: await seedNotificaties(20),
    });
}
async function seedNotificaties(aantal) {
    const notificaties = [];
    for (let i = 0; i < aantal; i++) {
        notificaties.push({
            tijdstip: faker_1.faker.date.recent(),
            bericht: faker_1.faker.lorem.sentence(),
            gelezen: faker_1.faker.datatype.boolean(),
        });
    }
    return notificaties;
}
async function seedKPIs() {
    const KPIs = [];
    const MNGR_KPI_1 = {
        onderwerp: 'Algemene gezondheid alle sites',
        roles: roles_1.default.MANAGER,
        grafiek: client_1.Grafiek.SINGLE,
    };
    const MNGR_KPI_2 = {
        onderwerp: 'Algemene gezondheid site x',
        roles: roles_1.default.MANAGER,
        grafiek: client_1.Grafiek.SITES,
    };
    const MNGR_KPI_3 = {
        onderwerp: 'Productiegraad alle sites gesorteerd (hoog naar laag)',
        roles: roles_1.default.MANAGER,
        grafiek: client_1.Grafiek.BAR,
    };
    const MNGR_KPI_4 = {
        onderwerp: 'Productiegraad alle sites gesorteerd (laag naar hoog)',
        roles: roles_1.default.MANAGER,
        grafiek: client_1.Grafiek.BAR,
    };
    KPIs.push(MNGR_KPI_1, MNGR_KPI_2, MNGR_KPI_3, MNGR_KPI_4);
    const VW_KPI_1 = {
        onderwerp: 'Top 5 gezonde machines',
        roles: roles_1.default.VERANTWOORDELIJKE,
        grafiek: client_1.Grafiek.TOP5,
    };
    const VW_KPI_2 = {
        onderwerp: 'Top 5 falende machines',
        roles: roles_1.default.VERANTWOORDELIJKE,
        grafiek: client_1.Grafiek.TOP5,
    };
    const VW_KPI_3 = {
        onderwerp: 'Top 5 machines met nood aan onderhoud',
        roles: roles_1.default.VERANTWOORDELIJKE,
        grafiek: client_1.Grafiek.TOP5,
    };
    KPIs.push(VW_KPI_1, VW_KPI_2, VW_KPI_3);
    const TECH_KPI_1 = {
        onderwerp: 'Aankomende onderhoudsbeurten',
        roles: roles_1.default.TECHNIEKER,
        grafiek: client_1.Grafiek.TOP5OND,
    };
    const TECH_KPI_2 = {
        onderwerp: 'Laatste 5 onderhoudsbeurten',
        roles: roles_1.default.TECHNIEKER,
        grafiek: client_1.Grafiek.TOP5OND,
    };
    KPIs.push(TECH_KPI_1, TECH_KPI_2);
    const VW_TECH_KPI_1 = {
        onderwerp: 'Draaiende machines',
        roles: [roles_1.default.VERANTWOORDELIJKE, roles_1.default.TECHNIEKER],
        grafiek: client_1.Grafiek.SINGLE,
    };
    const VW_TECH_KPI_2 = {
        onderwerp: 'Manueel gestopte machines',
        roles: [roles_1.default.VERANTWOORDELIJKE, roles_1.default.TECHNIEKER],
        grafiek: client_1.Grafiek.SINGLE,
    };
    const VW_TECH_KPI_3 = {
        onderwerp: 'Automatisch gestopte machines',
        roles: [roles_1.default.VERANTWOORDELIJKE, roles_1.default.TECHNIEKER],
        grafiek: client_1.Grafiek.SINGLE,
    };
    const VW_TECH_KPI_4 = {
        onderwerp: 'Machines in onderhoud',
        roles: [roles_1.default.VERANTWOORDELIJKE, roles_1.default.TECHNIEKER],
        grafiek: client_1.Grafiek.SINGLE,
    };
    const VW_TECH_KPI_5 = {
        onderwerp: 'Startbare machines',
        roles: [roles_1.default.VERANTWOORDELIJKE, roles_1.default.TECHNIEKER],
        grafiek: client_1.Grafiek.SINGLE,
    };
    const VW_TECH_KPI_6 = {
        onderwerp: 'Mijn machines',
        roles: [roles_1.default.VERANTWOORDELIJKE, roles_1.default.TECHNIEKER],
        grafiek: client_1.Grafiek.LIST,
    };
    KPIs.push(VW_TECH_KPI_1, VW_TECH_KPI_2, VW_TECH_KPI_3, VW_TECH_KPI_4, VW_TECH_KPI_5, VW_TECH_KPI_6);
    return KPIs;
}
async function seedAdressen(aantal) {
    const adressen = [];
    for (let i = 0; i < aantal; i++) {
        adressen.push({
            straat: String(faker_1.faker.location.street()),
            huisnummer: String(faker_1.faker.location.buildingNumber()),
            stadsnaam: String(faker_1.faker.location.city()),
            postcode: String(faker_1.faker.location.zipCode()),
            land: String(faker_1.faker.location.country()),
        });
    }
    return adressen;
}
async function seedGebruikers(aantal) {
    const gebruikers = [];
    const bestaandeAdressen = await prisma.adres.findMany();
    const robert = {
        adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
        naam: 'Devree',
        voornaam: 'Robert',
        geboortedatum: faker_1.faker.date.birthdate(),
        email: 'robert.devree@hotmail.com',
        wachtwoord: await (0, password_1.hashPassword)('123456789'),
        gsm: String(faker_1.faker.phone.number()),
        rol: roles_1.default.MANAGER,
        status: client_1.Status.ACTIEF,
    };
    const alice = {
        adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
        voornaam: 'Alice',
        naam: 'Johnson',
        geboortedatum: faker_1.faker.date.birthdate(),
        email: 'alice.admin@example.com',
        wachtwoord: await (0, password_1.hashPassword)('123456789'),
        gsm: String(faker_1.faker.phone.number()),
        rol: roles_1.default.ADMINISTRATOR,
        status: client_1.Status.ACTIEF,
    };
    const bob = {
        adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
        naam: 'Smith',
        voornaam: 'Bob',
        geboortedatum: faker_1.faker.date.birthdate(),
        email: 'bob.manager@example.com',
        wachtwoord: await (0, password_1.hashPassword)('123456789'),
        gsm: String(faker_1.faker.phone.number()),
        rol: roles_1.default.MANAGER,
        status: client_1.Status.ACTIEF,
    };
    const charlie = {
        adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
        naam: 'Davis',
        voornaam: 'Charlie',
        geboortedatum: faker_1.faker.date.birthdate(),
        email: 'charlie.verantwoordelijke@example.com',
        wachtwoord: await (0, password_1.hashPassword)('123456789'),
        gsm: String(faker_1.faker.phone.number()),
        rol: roles_1.default.VERANTWOORDELIJKE,
        status: client_1.Status.ACTIEF,
    };
    const david = {
        adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
        naam: 'Williams',
        voornaam: 'David',
        geboortedatum: faker_1.faker.date.birthdate(),
        email: 'david.technieker@example.com',
        wachtwoord: await (0, password_1.hashPassword)('123456789'),
        gsm: String(faker_1.faker.phone.number()),
        rol: roles_1.default.TECHNIEKER,
        status: client_1.Status.ACTIEF,
    };
    gebruikers.push(robert);
    gebruikers.push(alice);
    gebruikers.push(bob);
    gebruikers.push(charlie);
    gebruikers.push(david);
    for (let i = 0; i < aantal; i++) {
        const naam = faker_1.faker.person.lastName();
        const voornaam = faker_1.faker.person.firstName();
        const wachtwoord = await (0, password_1.hashPassword)('123456789');
        gebruikers.push({
            adres_id: Number(bestaandeAdressen[Math.floor(Math.random() * bestaandeAdressen.length)].id),
            naam: String(naam),
            voornaam: String(voornaam),
            geboortedatum: faker_1.faker.date.birthdate(),
            email: String(faker_1.faker.internet.email({ firstName: voornaam, lastName: naam })),
            wachtwoord: wachtwoord,
            gsm: String(faker_1.faker.phone.number()),
            rol: String(i == 0 ? roles_1.default.ADMINISTRATOR : i % 2 == 0 ? roles_1.default.MANAGER : i % 3 == 0 ? roles_1.default.TECHNIEKER : roles_1.default.VERANTWOORDELIJKE),
            status: i == 1 ? client_1.Status.INACTIEF : client_1.Status.ACTIEF,
        });
    }
    return gebruikers;
}
async function seedSites(aantal) {
    const sites = [];
    const bestaandeGebruikers = await prisma.gebruiker.findMany({
        where: {
            rol: {
                equals: roles_1.default.VERANTWOORDELIJKE,
            },
        },
    });
    for (let i = 0; i < aantal; i++) {
        sites.push({
            naam: String(faker_1.faker.company.name()),
            verantwoordelijke_id: Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
            status: client_1.Status.ACTIEF,
        });
    }
    return sites;
}
async function seedProducten(aantal) {
    const producten = [];
    for (let i = 0; i < aantal; i++) {
        producten.push({
            naam: faker_1.faker.commerce.product(),
        });
    }
    return producten;
}
async function seedMachines(aantal) {
    const machines = [];
    const bestaandeSites = await prisma.site.findMany();
    const bestaansdeProducten = await prisma.product.findMany();
    const bestaandeGebruikers = await prisma.gebruiker.findMany({
        where: {
            rol: {
                equals: roles_1.default.TECHNIEKER,
            },
        },
    });
    for (let i = 0; i < aantal; i++) {
        machines.push({
            site_id: Number(bestaandeSites[Math.floor(Math.random() * bestaandeSites.length)].id),
            product_id: Number(bestaansdeProducten[Math.floor(Math.random() * bestaansdeProducten.length)].id),
            technieker_gebruiker_id: Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
            code: String(faker_1.faker.commerce.isbn()),
            locatie: String(faker_1.faker.location.street()),
            status: Object.values(client_1.Machine_Status)[Math.floor(Math.random() * Object.values(client_1.Machine_Status).length)],
            product_informatie: faker_1.faker.lorem.sentence(),
            productie_status: Object.values(client_1.Productie_Status)[Math.floor(Math.random() * Object.values(client_1.Productie_Status).length)],
        });
    }
    return machines;
}
async function seedOnderhouden(aantal) {
    const onderhouden = [];
    const bestaandeMachines = await prisma.machine.findMany();
    const bestaandeGebruikers = await prisma.gebruiker.findMany({
        where: {
            rol: {
                equals: roles_1.default.TECHNIEKER,
            },
        },
    });
    for (let i = 0; i < aantal; i++) {
        onderhouden.push({
            machine_id: Number(bestaandeMachines[Math.floor(Math.random() * bestaandeMachines.length)].id),
            technieker_gebruiker_id: Number(bestaandeGebruikers[Math.floor(Math.random() * bestaandeGebruikers.length)].id),
            datum: faker_1.faker.date.anytime(),
            starttijdstip: faker_1.faker.date.past(),
            eindtijdstip: faker_1.faker.date.future(),
            reden: faker_1.faker.lorem.sentence(),
            status: Object.values(client_1.Onderhoud_Status)[Math.floor(Math.random() * Object.values(client_1.Onderhoud_Status).length)],
            opmerkingen: faker_1.faker.lorem.paragraph(),
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
