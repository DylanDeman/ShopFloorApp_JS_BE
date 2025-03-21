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
exports.default = installAdresRoutes;
const router_1 = __importDefault(require("@koa/router"));
const joi_1 = __importDefault(require("joi"));
const adresService = __importStar(require("../service/adres"));
const validation_1 = __importDefault(require("../core/validation"));
const auth_1 = require("../core/auth");
const getAllAdresses = async (ctx) => {
    ctx.body = {
        items: await adresService.getAll(),
    };
};
getAllAdresses.validationScheme = null;
const createAdres = async (ctx) => {
    const newAdres = await adresService.create({
        ...ctx.request.body,
    });
    ctx.status = 201;
    ctx.body = newAdres;
};
createAdres.validationScheme = {
    body: {
        straat: joi_1.default.string(),
        huisnummer: joi_1.default.string(),
        stadsnaam: joi_1.default.string(),
        postcode: joi_1.default.string(),
        land: joi_1.default.string(),
    },
};
const getAdresById = async (ctx) => {
    ctx.body = await adresService.getById(ctx.params.id);
};
getAdresById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
const updateAdres = async (ctx) => {
    const updatedAdres = await adresService.updateById(ctx.params.id, {
        ...ctx.request.body,
    });
    ctx.body = { id: ctx.params.id, ...updatedAdres };
};
updateAdres.validationScheme = {
    params: { id: joi_1.default.number().integer().positive() },
    body: {
        straat: joi_1.default.string(),
        huisnummer: joi_1.default.string(),
        stadsnaam: joi_1.default.string(),
        postcode: joi_1.default.string(),
        land: joi_1.default.string(),
    },
};
const deleteAdres = async (ctx) => {
    await adresService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteAdres.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
function installAdresRoutes(parent) {
    const router = new router_1.default({
        prefix: '/adres',
    });
    router.use(auth_1.requireAuthentication);
    router.get('/', (0, validation_1.default)(getAllAdresses.validationScheme), getAllAdresses);
    router.post('/', (0, validation_1.default)(createAdres.validationScheme), createAdres);
    router.get('/:id', (0, validation_1.default)(getAdresById.validationScheme), getAdresById);
    router.put('/:id', (0, validation_1.default)(updateAdres.validationScheme), updateAdres);
    router.delete('/:id', (0, validation_1.default)(deleteAdres.validationScheme), deleteAdres);
    parent.use(router.routes())
        .use(router.allowedMethods());
}
;
