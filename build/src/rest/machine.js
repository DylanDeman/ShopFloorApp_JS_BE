"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const machineService = __importStar(require("../service/machine"));
const onderhoudService = __importStar(require("../service/onderhoud"));
const validation_1 = __importDefault(require("../core/validation"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../core/auth");
const getAllMachines = async (ctx) => {
    const machines = await machineService.getAllMachines();
    const onderhoud = await onderhoudService.getAllOnderhouden();
    ctx.body = {
        items: machines,
        onderhoud: onderhoud.items,
    };
};
getAllMachines.validationScheme = null;
const getMachineById = async (ctx) => {
    ctx.body = await machineService.getMachineById(ctx.params.id);
};
getMachineById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const updateMachineById = async (ctx) => {
    ctx.body = await machineService.updateMachineById(ctx.params.id, ctx.request.body);
};
updateMachineById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
    body: {
        product_id: joi_1.default.number().integer().positive(),
        technieker_gebruiker_id: joi_1.default.number().integer().positive(),
        code: joi_1.default.string(),
        locatie: joi_1.default.string(),
        status: joi_1.default.string(),
        productie_status: joi_1.default.string(),
        product_informatie: joi_1.default.string().allow('').optional(),
    },
};
const createMachine = async (ctx) => {
    const newMachine = await machineService.createMachine(ctx.request.body);
    ctx.status = 201;
    ctx.body = newMachine;
};
createMachine.validationScheme = {
    body: {
        site_id: joi_1.default.number().integer().positive().required(),
        product_id: joi_1.default.number().integer().positive().required(),
        technieker_gebruiker_id: joi_1.default.number().integer().positive().required(),
        code: joi_1.default.string().max(255).required(),
        locatie: joi_1.default.string().max(255).required(),
        status: joi_1.default.string().valid('DRAAIT', 'MANUEEL_GESTOPT', 'AUTMATISCH_GESTOPT', 'IN_ONDERHOUD', 'AUTOMATISCH_GESTOPT', 'STARTBAAR').required(),
        productie_status: joi_1.default.string().valid('GEZOND', 'NOOD_ONDERHOUD', 'FALEND').required(),
        product_informatie: joi_1.default.string().allow('').optional(),
    },
};
exports.default = (parent) => {
    const router = new router_1.default({
        prefix: '/machines',
    });
    router.get('/', auth_1.requireAuthentication, (0, validation_1.default)(getAllMachines.validationScheme), getAllMachines);
    router.get('/:id', auth_1.requireAuthentication, (0, validation_1.default)(getMachineById.validationScheme), getMachineById);
    router.put('/:id', auth_1.requireAuthentication, (0, validation_1.default)(updateMachineById.validationScheme), updateMachineById);
    router.post('/', auth_1.requireAuthentication, (0, validation_1.default)(createMachine.validationScheme), createMachine);
    parent.use(router.routes()).use(router.allowedMethods());
};
