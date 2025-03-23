import Router from '@koa/router';
import Joi from 'joi';
import * as kpiService from '../service/kpi';
import * as kpiwaardenService from '../service/kpiwaarden';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { GetAllKPIsReponse, GetKPIByIdResponse } from '../types/kpi';
import type { GetAllKPIWaardenReponse } from '../types/kpiwaarden';
import type { IdParams, RoleParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @swagger
 * /api/kpi:
 *   get:
 *     summary: Get all KPIs
 *     tags: [KPI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all KPIs
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
 *                       name:
 *                         type: string
 */
const getAllKPIs = async (ctx: KoaContext<GetAllKPIsReponse>) => {
  ctx.body = {
    items: await kpiService.getAll(),
  };
};
getAllKPIs.validationScheme = null;

/**
 * @swagger
 * /api/kpi/{id}:
 *   get:
 *     summary: Get KPI by ID
 *     tags: [KPI]
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
 *         description: KPI details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 */
const getKPIById = async (ctx: KoaContext<GetKPIByIdResponse, IdParams>) => {
  ctx.body = await kpiService.getById(ctx.params.id);
};
getKPIById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/kpi/{id}:
 *   delete:
 *     summary: Delete KPI by ID
 *     tags: [KPI]
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
 *         description: KPI successfully deleted
 */
const deleteKPI = async (ctx: KoaContext<void, IdParams>) => {
  await kpiService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteKPI.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/kpi/{id}/kpiwaarden:
 *   get:
 *     summary: Get KPI values by KPI ID
 *     tags: [KPI]
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
 *         description: KPI values for the given KPI ID
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
 *                       kpi_id:
 *                         type: integer
 *                       value:
 *                         type: string
 */
const getKPIWaardenByKPIid = async (ctx: KoaContext<GetAllKPIWaardenReponse, IdParams>) => {
  const kpiwaarden = await kpiwaardenService.getKPIWaardenByKPIid(ctx.params.id);
  ctx.body = {
    items: kpiwaarden,
  };
};
getKPIWaardenByKPIid.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/kpi/rol/{role}:
 *   get:
 *     summary: Get KPIs by role
 *     tags: [KPI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ADMINISTRATOR, MANAGER, VERANTWOORDELIJKE, TECHNIEKER]
 *     responses:
 *       200:
 *         description: KPIs for the given role
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
 *                       name:
 *                         type: string
 */
const getKPIByRole = async (ctx: KoaContext<GetAllKPIsReponse, RoleParams>) => {
  const kpis = await kpiService.getKPIByRole(ctx.params.role);
  ctx.body = {
    items: kpis,
  };
};
getKPIByRole.validationScheme = {
  params: {
    role: Joi.string().valid('ADMINISTRATOR', 'MANAGER', 'VERANTWOORDELIJKE', 'TECHNIEKER').required(),
  },
};

/**
 * Install routes for KPI-related operations
 */
export default function installKPIRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/kpi',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllKPIs.validationScheme), getAllKPIs);
  router.get('/:id', validate(getKPIById.validationScheme), getKPIById);
  router.get('/:id/kpiwaarden', validate(getKPIWaardenByKPIid.validationScheme), getKPIWaardenByKPIid);
  router.delete('/:id', validate(deleteKPI.validationScheme), deleteKPI);
  router.get('/rol/:role', validate(getKPIByRole.validationScheme), getKPIByRole);

  parent.use(router.routes()).use(router.allowedMethods());
};
