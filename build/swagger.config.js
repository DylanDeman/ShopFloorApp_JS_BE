"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    failOnErrors: true,
    apis: ['./src/rest/*.ts'],
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend API SDPII with Swagger',
            version: '0.1.0',
            description: 'Backend API for Software Development Project II',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
        servers: [{ url: 'http://localhost:9000/' }],
    },
};
