import Router from '@koa/router';
import Joi from 'joi';
import * as kpiwaardenService from '../service/kpiwaarden';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { GetAllKPIWaardenReponse, GetKPIWaardeByIdResponse } from '../types/kpiwaarden';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @swagger
 * /api/kpiwaarden:
 *   get:
 *     summary: Get all KPI values
 *     tags: [KPIWaarden]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all KPI values
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
const getAllKPIWaarden = async (ctx: KoaContext<GetAllKPIWaardenReponse>) => {
  ctx.body = {
    items: await kpiwaardenService.getAll(),
  };
};
getAllKPIWaarden.validationScheme = null;

/**
 * @swagger
 * /api/kpiwaarden/{id}:
 *   get:
 *     summary: Get KPI value by ID
 *     tags: [KPIWaarden]
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
 *         description: KPI value details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 kpi_id:
 *                   type: integer
 *                 value:
 *                   type: string
 */
const getKPIWaardeById = async (ctx: KoaContext<GetKPIWaardeByIdResponse, IdParams>) => {
  ctx.body = await kpiwaardenService.getById(ctx.params.id);
};
getKPIWaardeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install routes for KPI value-related operations
 */
export default function installKPIWaardenRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/kpiwaarden',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllKPIWaarden.validationScheme), getAllKPIWaarden);
  router.get('/:id', validate(getKPIWaardeById.validationScheme), getKPIWaardeById);

  parent.use(router.routes()).use(router.allowedMethods());
};
