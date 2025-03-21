"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.initializeData = initializeData;
exports.shutdownData = shutdownData;
const client_1 = require("@prisma/client");
const logging_1 = require("../core/logging");
exports.prisma = new client_1.PrismaClient();
async function initializeData() {
    (0, logging_1.getLogger)().info('Initializing connection to the database');
    await exports.prisma.$connect();
    (0, logging_1.getLogger)().info('Successfully connected to the database');
}
async function shutdownData() {
    (0, logging_1.getLogger)().info('Shutting down database connection');
    await exports.prisma?.$disconnect();
    (0, logging_1.getLogger)().info('Database connection closed');
}
