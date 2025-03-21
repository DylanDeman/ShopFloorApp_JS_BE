"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    coverageProvider: 'v8',
    preset: 'ts-jest',
    testMatch: [
        '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
    ],
};
exports.default = config;
