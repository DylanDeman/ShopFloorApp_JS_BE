import Router from '@koa/router';
import * as dashboardService from '../service/dashboard';
import type { KoaContext, KoaRouter, ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import validate from '../core/validation';
import type { 
  getAllDashboardsResponse, 
  getDashboardByIdResponse, 
  CreateDashboardRequest, 
  CreateDashboardResponse, 
} from '../types/dashboard';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get all dashboards
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all dashboards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       gebruiker_id:
 *                         type: integer
 *                       kpi_id:
 *                         type: integer
 */
const getAllDashboards = async (ctx: KoaContext<getAllDashboardsResponse>) => {
  ctx.body = {
    items: await dashboardService.getAllDashboards(),
  };
};
getAllDashboards.validationScheme = null;

/**
 * @swagger
 * /api/dashboard/{id}:
 *   get:
 *     summary: Get dashboard by ID
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dashboard details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 gebruiker_id:
 *                   type: integer
 *                 kpi_id:
 *                   type: integer
 */
const getDashboardById = async (ctx: KoaContext<getDashboardByIdResponse, IdParams>) => {
  ctx.body = await dashboardService.getDashboardById(ctx.params.id);
};
getDashboardById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/dashboard/{id}:
 *   delete:
 *     summary: Delete dashboard by ID
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Dashboard successfully deleted
 */
const deleteDashboard = async (ctx: KoaContext<void, IdParams>) => {
  await dashboardService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteDashboard.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/dashboard:
 *   post:
 *     summary: Create a new dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gebruiker_id:
 *                 type: integer
 *               kpi_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Dashboard created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 gebruiker_id:
 *                   type: integer
 *                 kpi_id:
 *                   type: integer
 */
const createDashboard = async (ctx: KoaContext<CreateDashboardResponse, void, CreateDashboardRequest>) => {
  const dashboard = await dashboardService.create({ ...ctx.request.body });
  ctx.status = 201;
  ctx.body = dashboard;
};
createDashboard.validationScheme = {
  body: {
    gebruiker_id: Joi.number().integer().positive(),
    kpi_id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/dashboard',
  });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllDashboards.validationScheme),
    getAllDashboards,
  );

  router.get(
    '/:id',
    validate(getDashboardById.validationScheme),
    getDashboardById,
  );

  router.delete(
    '/:id', 
    validate(deleteDashboard.validationScheme), 
    deleteDashboard,
  );
  
  router.post(
    '/', 
    validate(createDashboard.validationScheme), 
    createDashboard,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
