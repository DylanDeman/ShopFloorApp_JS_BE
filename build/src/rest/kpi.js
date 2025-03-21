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
exports.default = installKPIRoutes;
const router_1 = __importDefault(require("@koa/router"));
const joi_1 = __importDefault(require("joi"));
const kpiService = __importStar(require("../service/kpi"));
const kpiwaardenService = __importStar(require("../service/kpiwaarden"));
const validation_1 = __importDefault(require("../core/validation"));
const auth_1 = require("../core/auth");
const getAllKPIs = async (ctx) => {
    ctx.body = {
        items: await kpiService.getAll(),
    };
};
getAllKPIs.validationScheme = null;
const getKPIById = async (ctx) => {
    ctx.body = await kpiService.getById(ctx.params.id);
};
getKPIById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const deleteKPI = async (ctx) => {
    await kpiService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteKPI.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const getKPIWaardenByKPIid = async (ctx) => {
    const kpiwaarden = await kpiwaardenService.getKPIWaardenByKPIid(ctx.params.id);
    ctx.body = {
        items: kpiwaarden,
    };
};
getKPIWaardenByKPIid.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const getKPIByRole = async (ctx) => {
    const kpis = await kpiService.getKPIByRole(ctx.params.role);
    ctx.body = {
        items: kpis,
    };
};
getKPIByRole.validationScheme = {
    params: {
        role: joi_1.default.string().valid('ADMINISTRATOR', 'MANAGER', 'VERANTWOORDELIJKE', 'TECHNIEKER').required(),
    },
};
function installKPIRoutes(parent) {
    const router = new router_1.default({
        prefix: '/kpi',
    });
    router.use(auth_1.requireAuthentication);
    router.get('/', (0, validation_1.default)(getAllKPIs.validationScheme), getAllKPIs);
    router.get('/:id', (0, validation_1.default)(getKPIById.validationScheme), getKPIById);
    router.get('/:id/kpiwaarden', (0, validation_1.default)(getKPIWaardenByKPIid.validationScheme), getKPIWaardenByKPIid);
    router.delete('/:id', (0, validation_1.default)(deleteKPI.validationScheme), deleteKPI);
    router.get('/rol/:role', (0, validation_1.default)(getKPIByRole.validationScheme), getKPIByRole);
    parent.use(router.routes())
        .use(router.allowedMethods());
}
;
