"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = installMiddlewares;
const config_1 = __importDefault(require("config"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa2_swagger_ui_1 = require("koa2-swagger-ui");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_config_1 = __importDefault(require("../../swagger.config"));
const logging_1 = require("./logging");
const serviceError_1 = __importDefault(require("./serviceError"));
const NODE_ENV = config_1.default.get('env');
const CORS_ORIGINS = config_1.default.get('cors.origins');
const CORS_MAX_AGE = config_1.default.get('cors.maxAge');
const isDevelopment = NODE_ENV === 'development';
function installMiddlewares(app) {
    app.use((0, cors_1.default)({
        origin: (ctx) => {
            if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
                return ctx.request.header.origin;
            }
            return CORS_ORIGINS[0] || '';
        },
        allowHeaders: [
            'Accept',
            'Content-Type',
            'Authorization',
        ],
        maxAge: CORS_MAX_AGE,
    }));
    app.use(async (ctx, next) => {
        (0, logging_1.getLogger)().info(`⏩ ${ctx.method} ${ctx.url}`);
        const getStatusEmoji = () => {
            if (ctx.status >= 500)
                return '💀';
            if (ctx.status >= 400)
                return '❌';
            if (ctx.status >= 300)
                return '🔀';
            if (ctx.status >= 200)
                return '✅';
            return '🔄';
        };
        await next();
        (0, logging_1.getLogger)().info(`${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`);
    });
    app.use((0, koa_bodyparser_1.default)());
    app.use((0, koa_helmet_1.default)({
        contentSecurityPolicy: !isDevelopment,
    }));
    app.use(async (ctx, next) => {
        try {
            await next();
        }
        catch (error) {
            (0, logging_1.getLogger)().error('Error occured while handling a request', { error });
            let statusCode = error.status || 500;
            const errorBody = {
                code: error.code || 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Unexpected error occurred. Please try again later.',
                details: error.details,
                stack: NODE_ENV !== 'production' ? error.stack : undefined,
            };
            if (error instanceof serviceError_1.default) {
                errorBody.message = error.message;
                if (error.isNotFound) {
                    statusCode = 404;
                }
                if (error.isValidationFailed) {
                    statusCode = 400;
                }
                if (error.isUnauthorized) {
                    statusCode = 401;
                }
                if (error.isForbidden) {
                    statusCode = 403;
                }
                if (error.isConflict) {
                    statusCode = 409;
                }
            }
            ctx.status = statusCode;
            ctx.body = errorBody;
        }
    });
    if (isDevelopment) {
        const spec = (0, swagger_jsdoc_1.default)(swagger_config_1.default);
        app.use((0, koa2_swagger_ui_1.koaSwagger)({
            routePrefix: '/swagger',
            specPrefix: '/swagger.json',
            exposeSpec: true,
            swaggerOptions: { spec },
        }));
    }
    app.use(async (ctx, next) => {
        await next();
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = {
                code: 'NOT_FOUND',
                message: `Unknown resource: ${ctx.url}`,
            };
        }
    });
}
