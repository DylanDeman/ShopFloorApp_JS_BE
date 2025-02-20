import Router from '@koa/router';
import * as healthService from '../service/health';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';
import validate from '../core/validation';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

/**
 * @swagger
 * /api/health/ping:
 *   get:
 *     summary: Ping the server
 *     tags:
 *      - Health
 *     responses:
 *       200:
 *         description: Server pongs back
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - pong
 *               properties:
 *                 pong:
 *                   type: boolean
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

/**
 * @swagger
 * /api/health/version:
 *   get:
 *     summary: Get the server's version information
 *     tags:
 *      - Health
 *     responses:
 *       200:
 *         description: The server's running version information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - env
 *                 - version
 *                 - name
 *               properties:
 *                 env:
 *                   type: string
 *                 version:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 */
const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

export default function installPlacesRoutes(parent: KoaRouter) {
  const router = new Router<BudgetAppState, BudgetAppContext>({ prefix: '/health' });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};