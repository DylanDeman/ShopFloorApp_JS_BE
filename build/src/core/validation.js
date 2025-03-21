"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const JOI_OPTIONS = {
    abortEarly: true,
    allowUnknown: false,
    convert: true,
    presence: 'required',
};
const cleanupJoiError = (error) => {
    const errorDetails = error.details.reduce((resultObj, { message, path, type }) => {
        const joinedPath = path.join('.') || 'value';
        if (!resultObj.has(joinedPath)) {
            resultObj.set(joinedPath, []);
        }
        resultObj.get(joinedPath).push({
            type,
            message,
        });
        return resultObj;
    }, new Map());
    return Object.fromEntries(errorDetails);
};
const validate = (scheme) => {
    const parsedSchema = {
        body: joi_1.default.object(scheme?.body || {}),
        params: joi_1.default.object(scheme?.params || {}),
        query: joi_1.default.object(scheme?.query || {}),
    };
    return (ctx, next) => {
        const errors = new Map();
        const { error: paramsErrors, value: paramsValue } = parsedSchema.params.validate(ctx.params, JOI_OPTIONS);
        if (paramsErrors) {
            errors.set('params', cleanupJoiError(paramsErrors));
        }
        else {
            ctx.params = paramsValue;
        }
        const { error: bodyErrors, value: bodyValue } = parsedSchema.body.validate(ctx.request.body, JOI_OPTIONS);
        if (bodyErrors) {
            errors.set('body', cleanupJoiError(bodyErrors));
        }
        else {
            ctx.request.body = bodyValue;
        }
        const { error: queryErrors, value: queryValue } = parsedSchema.query.validate(ctx.query, JOI_OPTIONS);
        if (queryErrors) {
            errors.set('query', cleanupJoiError(queryErrors));
        }
        else {
            ctx.query = queryValue;
        }
        if (errors.size > 0) {
            ctx.throw(400, 'Validation failed, check details for more information', {
                code: 'VALIDATION_FAILED',
                details: Object.fromEntries(errors),
            });
        }
        return next();
    };
};
exports.default = validate;
