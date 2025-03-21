"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceError_1 = __importDefault(require("../core/serviceError"));
const handleDBError = (error) => {
    console.error('Database error occurred:', error);
    const { code = '', message } = error;
    if (code === 'P2002') {
        console.error('Unique constraint violation:', message);
        switch (true) {
            case message.includes('idx_place_name_unique'):
                throw serviceError_1.default.validationFailed('A place with this name already exists');
            case message.includes('idx_user_email_unique'):
                throw serviceError_1.default.validationFailed('There is already a user with this email address');
            default:
                throw serviceError_1.default.validationFailed('This item already exists');
        }
    }
    if (code === 'P2025') {
        console.error('Record not found:', message);
        switch (true) {
            case message.includes('fk_transaction_user'):
                throw serviceError_1.default.notFound('This user does not exist');
            case message.includes('fk_transaction_place'):
                throw serviceError_1.default.notFound('This place does not exist');
            case message.includes('transaction'):
                throw serviceError_1.default.notFound('No transaction with this ID exists');
            case message.includes('place'):
                throw serviceError_1.default.notFound('No place with this ID exists');
            case message.includes('user'):
                throw serviceError_1.default.notFound('No user with this ID exists');
        }
    }
    if (code === 'P2003') {
        console.error('Foreign key constraint violation:', message);
        switch (true) {
            case message.includes('place_id'):
                throw serviceError_1.default.conflict('This place is still linked to transactions');
            case message.includes('user_id'):
                throw serviceError_1.default.conflict('This user is still linked to transactions');
        }
    }
    console.error('Unhandled database error:', error);
    throw error;
};
exports.default = handleDBError;
