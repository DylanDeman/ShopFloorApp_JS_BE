"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getAllProducts = void 0;
const data_1 = require("../data");
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const getAllProducts = async () => {
    try {
        return await data_1.prisma.product.findMany({
            select: {
                id: true,
                naam: true,
            },
        });
    }
    catch (error) {
        (0, _handleDBError_1.default)(error);
        return [];
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    try {
        return await data_1.prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                naam: true,
            },
        });
    }
    catch (error) {
        (0, _handleDBError_1.default)(error);
        return null;
    }
};
exports.getProductById = getProductById;
