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
const siteService = __importStar(require("../service/site"));
const validation_1 = __importDefault(require("../core/validation"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../core/auth");
const roles_1 = __importDefault(require("../core/roles"));
const getAllSites = async (ctx) => {
    ctx.body = {
        items: await siteService.getAllSites(),
    };
};
getAllSites.validationScheme = null;
const getSiteById = async (ctx) => {
    ctx.body = await siteService.getSiteById(ctx.params.id);
};
getSiteById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const updateById = async (ctx) => {
    const id = ctx.params.id;
    const data = ctx.request.body;
    const updatedSite = await siteService.updateSiteById(id, data);
    ctx.status = 200;
    ctx.body = updatedSite;
};
updateById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive().required(),
    },
    body: {
        naam: joi_1.default.string().max(255),
        verantwoordelijke_id: joi_1.default.number().integer().positive().required(),
        status: joi_1.default.string().valid('ACTIEF', 'INACTIEF').required(),
        machines_ids: joi_1.default.array().items(joi_1.default.number().integer().positive()),
    },
};
const createSite = async (ctx) => {
    const newSite = await siteService.createSite(ctx.request.body);
    ctx.status = 201;
    ctx.body = newSite;
};
createSite.validationScheme = {
    body: {
        naam: joi_1.default.string().max(255).required(),
        verantwoordelijke_id: joi_1.default.number().integer().positive().required(),
        status: joi_1.default.string().valid('ACTIEF', 'INACTIEF').required(),
        machines_ids: joi_1.default.array().items(joi_1.default.number().integer().positive()),
    },
};
const deleteSiteById = async (ctx) => {
    const { id } = ctx.params;
    const deletedSite = await siteService.deleteSiteById(Number(id));
    ctx.status = 200;
    ctx.body = deletedSite;
};
deleteSiteById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive().required(),
    },
};
const requireManager = (0, auth_1.makeRequireRole)(roles_1.default.MANAGER);
exports.default = (parent) => {
    const router = new router_1.default({
        prefix: '/sites',
    });
    router.get('/', auth_1.requireAuthentication, requireManager, (0, validation_1.default)(getAllSites.validationScheme), getAllSites);
    router.get('/:id', auth_1.requireAuthentication, requireManager, (0, validation_1.default)(getSiteById.validationScheme), getSiteById);
    router.put('/:id', auth_1.requireAuthentication, requireManager, (0, validation_1.default)(updateById.validationScheme), updateById);
    router.post('/', auth_1.requireAuthentication, requireManager, (0, validation_1.default)(createSite.validationScheme), createSite);
    router.delete('/:id', auth_1.requireAuthentication, requireManager, (0, validation_1.default)(deleteSiteById.validationScheme), deleteSiteById);
    parent.use(router.routes()).use(router.allowedMethods());
};
