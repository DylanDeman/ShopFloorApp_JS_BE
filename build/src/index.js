"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createServer_1 = __importDefault(require("./createServer"));
async function main() {
    try {
        const server = await (0, createServer_1.default)();
        await server.start();
        async function onClose() {
            await server.stop();
            process.exit(0);
        }
        process.on('SIGTERM', onClose);
        process.on('SIGQUIT', onClose);
    }
    catch (error) {
        console.log('\n', error);
        process.exit(-1);
    }
}
main();
