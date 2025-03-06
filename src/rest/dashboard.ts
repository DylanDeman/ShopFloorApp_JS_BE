import Router from '@koa/router';
import * as dashboardService from '../service/dashboard';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type { getAllDashboardsResponse, getDashboardByIdResponse, CreateDashboardRequest, CreateDashboardResponse }
  from '../types/dashboard';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

const getAllDashboards = async (ctx: KoaContext<getAllDashboardsResponse>) => {
  ctx.body = {
    items: await dashboardService.getAllDashboards(),
  };
};
getAllDashboards.validationScheme = null;

const getDashboardById = async (ctx: KoaContext<getDashboardByIdResponse, IdParams>) => {
  ctx.body = await dashboardService.getDashboardById(
    ctx.params.id,
  );
};

getDashboardById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const deleteDashboard = async (ctx: KoaContext<void, IdParams>) => {
  await dashboardService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteDashboard.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createDashboard = async (ctx: KoaContext<CreateDashboardResponse, void, CreateDashboardRequest>) => {
  console.log(ctx.request.body);
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
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/dashboard',
  });

  router.get(
    '/',
    requireAuthentication,
    validate(getAllDashboards.validationScheme),
    getAllDashboards,
  );

  router.get(
    '/:id',
    requireAuthentication,
    validate(getDashboardById.validationScheme),
    getDashboardById,
  );

  router.delete('/:id', validate(deleteDashboard.validationScheme), deleteDashboard);
  router.post('/', validate(createDashboard.validationScheme), createDashboard);

  parent.use(router.routes()).use(router.allowedMethods());
};