import Router from '@koa/router';
import installHealthRouter from './health';
import installSessionRouter from './session';
import installSiteRouter from './site';
import type { BudgetAppContext, BudgetAppState, KoaApplication } from '../types/koa';
import installAdresRoutes from './adres';
import installUserRoutes from './user';
import installMachineRoutes from './machine';
import installNotificatieRoutes from './notificatie';
import installKPIRoutes from './kpi';
import installDashboardRouter from './dashboard';
import installOnderhoudRoutes from './onderhoud';

/**
 * @swagger
 * components:
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           format: "int32"
 *   parameters:
 *     idParam:
 *       in: path
 *       name: id
 *       description: Id of the item to fetch/update/delete
 *       required: true
 *       schema:
 *         type: integer
 *         format: "int32"
 *   securitySchemes:
 *     bearerAuth: # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT # optional, arbitrary value for documentation purposes
 *   responses:
 *     400BadRequest:
 *       description: You provided invalid data
 *     401Unauthorized:
 *       description: You need to be authenticated to access this resource
 *     403Forbidden:
 *       description: You don't have access to this resource
 *     404NotFound:
 *       description: The requested resource could not be found
 */

export default (app: KoaApplication) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/api',
  });

  installSiteRouter(router);
  installHealthRouter(router);
  installSessionRouter(router);
  installAdresRoutes(router);
  installUserRoutes(router);
  installMachineRoutes(router);
  installNotificatieRoutes(router);
  installKPIRoutes(router);
  installDashboardRouter(router);
  installOnderhoudRoutes(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};