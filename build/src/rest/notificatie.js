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
const notificatieService = __importStar(require("../service/notificatie"));
const validation_1 = __importDefault(require("../core/validation"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../core/auth");
const getAllNotificaties = async (ctx) => {
    const { items, total } = await notificatieService.getAllNotificaties();
    ctx.body = {
        items,
        total,
    };
};
getAllNotificaties.validationScheme = null;
const getNotificatieById = async (ctx) => {
    ctx.body = await notificatieService.getNotificatieById(ctx.params.id);
};
getNotificatieById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const createNotificatie = async (ctx) => {
    const newNotificatie = await notificatieService.createNotificatie(ctx.request.body);
    ctx.status = 201;
    ctx.body = newNotificatie;
};
createNotificatie.validationScheme = {
    body: {
        bericht: joi_1.default.string(),
        tijdstip: joi_1.default.date(),
        gelezen: joi_1.default.bool().optional().default(false),
    },
};
const updateNotificatieById = async (ctx) => {
    ctx.body = await notificatieService.updateNotificatieById(ctx.params.id, ctx.request.body);
};
updateNotificatieById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
    body: {
        tijdstip: joi_1.default.date(),
        bericht: joi_1.default.string(),
        gelezen: joi_1.default.bool(),
    },
};
exports.default = (parent) => {
    const router = new router_1.default({
        prefix: '/notificaties',
    });
    router.get('/', auth_1.requireAuthentication, (0, validation_1.default)(getAllNotificaties.validationScheme), getAllNotificaties);
    router.get('/:id', auth_1.requireAuthentication, (0, validation_1.default)(getNotificatieById.validationScheme), getNotificatieById);
    router.put('/:id', auth_1.requireAuthentication, (0, validation_1.default)(updateNotificatieById.validationScheme), updateNotificatieById);
    router.post('/', auth_1.requireAuthentication, (0, validation_1.default)(createNotificatie.validationScheme), createNotificatie);
    parent.use(router.routes()).use(router.allowedMethods());
};
