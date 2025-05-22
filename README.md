# 2025-nodejs-gent12
## Disclaimer: This is not an official Delaware product! The use of the Delaware logo is just for layout purposes, because Delaware was the "client"
Groepsleden:
- Robin Ledoux [robin.ledoux@student.hogent.be](mailto:robin.ledoux@student.hogent.be)
- Milan Dhondt [milan.dhondt@student.hogent.be](mailto:milan.dhondt@student.hogent.be)
- Dogukan Uyanik [dogukan.uyanik@student.hogent.be](mailto:dogukan.uyanik@student.hogent.be)
- Sijad Walipoor [sijad.walipoor@student.hogent.be](mailto:sijad.walipoor@student.hogent.be)
- Dylan De Man [dylan.deman@student.hogent.be](mailto:dylan.deman@student.hogent.be) 


Inloggegevens testaccounts:

## Administrator
alice.admin@example.com
123456789

## Manager
bob.manager@example.com
123456789

## Verantwoordelijke
charlie.verantwoordelijke@example.com
123456789

## Technieker
david.technieker@example.com
123456789

## Requirements

Volgende software moet geïnstalleerd zijn:
- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Voordat u het project test of runt

Maak een `.env` (development) or `.env.test` (testing) bestand met het volgende sjabloon.
Vul de variabelen aan met de nodige gegevens.

# .env bestand
```bash
NODE_ENV=production (of testing of development)
DATABASE_URL="mysql://<USERNAME>:<WACHTWOORD>@localhost:3306/<DATABASE_NAME>"
```

## Start up

### Development

- Enable Corepack: `corepack enable`
- Installeer alle dependencies: `yarn`
- Zorg voor een `.env` (zie sjabloon hierboven)
- Run de migraties: `yarn migrate:dev`
- Start de development server: `yarn start:dev`

### Productie

- Enable Corepack: `corepack enable`
- Installeer alle dependencies: `yarn`
- Zorg voor een `.env` (zie sjabloon hierboven)
- Run de migraties: `yarn prisma migrate deploy`
- Build the project: `yarn build`
- Start de production server: `node build/src/index.js`

## Testing

Deze server zal de gegeven database maken wanneer de server is gestart.

- Enable Corepack: `corepack enable`
- Installeer alle dependencies: `yarn`
- Zorg voor een `.env.test` (zie sjabloon hierboven)
- Run de migraties: `yarn migrate:test`
- Run de testen: `yarn test`
  - Dit gaat een nieuwe server starten voor elke test suite die runt, u zal geen output zien omdat logging uitgezet is om de output cleaner te maken.
- Run de testen met coverage: `yarn test:coverage`
  - Dit zal een coverage report genereren in de `__tests__/coverage` foler
  - Open `__tests__/coverage/lcov-report/index.html` in uw browser om het coverage report te zien.
