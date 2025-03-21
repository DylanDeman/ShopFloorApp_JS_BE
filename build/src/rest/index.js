"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const health_1 = __importDefault(require("./health"));
const session_1 = __importDefault(require("./session"));
const site_1 = __importDefault(require("./site"));
const adres_1 = __importDefault(require("./adres"));
const user_1 = __importDefault(require("./user"));
const machine_1 = __importDefault(require("./machine"));
const notificatie_1 = __importDefault(require("./notificatie"));
const kpi_1 = __importDefault(require("./kpi"));
const dashboard_1 = __importDefault(require("./dashboard"));
const onderhoud_1 = __importDefault(require("./onderhoud"));
const product_1 = __importDefault(require("./product"));
exports.default = (app) => {
    const router = new router_1.default({
        prefix: '/api',
    });
    (0, site_1.default)(router);
    (0, health_1.default)(router);
    (0, session_1.default)(router);
    (0, adres_1.default)(router);
    (0, user_1.default)(router);
    (0, machine_1.default)(router);
    (0, notificatie_1.default)(router);
    (0, kpi_1.default)(router);
    (0, dashboard_1.default)(router);
    (0, onderhoud_1.default)(router);
    (0, product_1.default)(router);
    app.use(router.routes())
        .use(router.allowedMethods());
};
