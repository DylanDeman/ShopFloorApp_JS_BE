"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN';
const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
const CONFLICT = 'CONFLICT';
class ServiceError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'ServiceError';
    }
    static notFound(message) {
        return new ServiceError(NOT_FOUND, message);
    }
    static validationFailed(message) {
        return new ServiceError(VALIDATION_FAILED, message);
    }
    static unauthorized(message) {
        return new ServiceError(UNAUTHORIZED, message);
    }
    static forbidden(message) {
        return new ServiceError(FORBIDDEN, message);
    }
    static internalServerError(message) {
        return new ServiceError(INTERNAL_SERVER_ERROR, message);
    }
    static conflict(message) {
        return new ServiceError(CONFLICT, message);
    }
    get isNotFound() {
        return this.code === NOT_FOUND;
    }
    get isValidationFailed() {
        return this.code === VALIDATION_FAILED;
    }
    get isUnauthorized() {
        return this.code === UNAUTHORIZED;
    }
    get isForbidden() {
        return this.code === FORBIDDEN;
    }
    get isInternalServerError() {
        return this.code === INTERNAL_SERVER_ERROR;
    }
    get isConflict() {
        return this.code === CONFLICT;
    }
}
exports.default = ServiceError;
