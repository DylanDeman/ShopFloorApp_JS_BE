import Router from '@koa/router';
import * as notificatieService from '../service/notificatie';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type {getAllNotificatiesResponse, getNotificatieByIdResponse} from '../types/notificatie';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

const getAllNotificaties = async (ctx: KoaContext<getAllNotificatiesResponse>) => {
  const page = parseInt(ctx.query.page as string) || 0;
  const limit = parseInt(ctx.query.limit as string) || 0;

  const { items, total } = await notificatieService.getAllNotificaties(page, limit);

  ctx.body = {
    items,
    total,
    totalPages: limit === 0 ? total : Math.ceil(total/limit),
    page,
    limit,
  };
};
getAllNotificaties.validationScheme = {
  query: {
    page: Joi.number().min(0).optional().default(0),
    limit: Joi.number().min(0).optional().default(0),
  },
};

const getNotificatieById = async (ctx: KoaContext<getNotificatieByIdResponse, IdParams>) => {
  ctx.body = await notificatieService.getNotificatieById(
    ctx.params.id,
  );
};

getNotificatieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/notificaties',
  });

  router.get(
    '/', 
    requireAuthentication,
    validate(getAllNotificaties.validationScheme), 
    getAllNotificaties,
  );

  router.get(
    '/:id', 
    requireAuthentication,
    validate(getNotificatieById.validationScheme), 
    getNotificatieById,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};