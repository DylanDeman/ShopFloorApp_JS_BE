"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    cors: {
        origins: ['https://novafox.duckdns.org/api/shopfloor_app'],
    },
    auth: {
        jwt: {
            expirationInterval: 7 * 24 * 60 * 60,
        },
    },
};
