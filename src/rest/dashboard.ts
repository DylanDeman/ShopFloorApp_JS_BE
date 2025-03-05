import Router from '@koa/router';
import * as dashboardService from '../service/dashboard';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type { getAllDashboardsResponse } from '../types/dashboard';
import type { getDashboardByIdResponse } from '../types/dashboard';
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

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/dashboards',
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

  parent.use(router.routes()).use(router.allowedMethods());
};