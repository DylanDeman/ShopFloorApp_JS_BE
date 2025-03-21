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
const dashboardService = __importStar(require("../service/dashboard"));
const validation_1 = __importDefault(require("../core/validation"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../core/auth");
const getAllDashboards = async (ctx) => {
    ctx.body = {
        items: await dashboardService.getAllDashboards(),
    };
};
getAllDashboards.validationScheme = null;
const getDashboardById = async (ctx) => {
    ctx.body = await dashboardService.getDashboardById(ctx.params.id);
};
getDashboardById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const deleteDashboard = async (ctx) => {
    await dashboardService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteDashboard.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const createDashboard = async (ctx) => {
    console.log(ctx.request.body);
    const dashboard = await dashboardService.create({ ...ctx.request.body });
    ctx.status = 201;
    ctx.body = dashboard;
};
createDashboard.validationScheme = {
    body: {
        gebruiker_id: joi_1.default.number().integer().positive(),
        kpi_id: joi_1.default.number().integer().positive(),
    },
};
exports.default = (parent) => {
    const router = new router_1.default({
        prefix: '/dashboard',
    });
    router.get('/', auth_1.requireAuthentication, (0, validation_1.default)(getAllDashboards.validationScheme), getAllDashboards);
    router.get('/:id', auth_1.requireAuthentication, (0, validation_1.default)(getDashboardById.validationScheme), getDashboardById);
    router.delete('/:id', (0, validation_1.default)(deleteDashboard.validationScheme), deleteDashboard);
    router.post('/', (0, validation_1.default)(createDashboard.validationScheme), createDashboard);
    parent.use(router.routes()).use(router.allowedMethods());
};
