import Router from '@koa/router';
import * as machineService from '../service/machine';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type { getMachineByIdResponse, getAllMachinesResponse } from '../types/machine';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

const getAllMachines = async (ctx: KoaContext<getAllMachinesResponse>) => {
  const page = parseInt(ctx.query.page as string) || 0;
  const limit = parseInt(ctx.query.limit as string) || 0;

  const { items, total } = await machineService.getAllMachines(page, limit);

  ctx.body = {
    items,
    total,
    totalPages: limit === 0 ? total : Math.ceil(total/limit),
    page,
    limit,
  };
};
getAllMachines.validationScheme = {
  query: {
    page: Joi.number().min(0).optional().default(0),
    limit: Joi.number().min(0).optional().default(0),
  },
};

const getMachineById = async (ctx: KoaContext<getMachineByIdResponse, IdParams>) => {
  ctx.body = await machineService.getMachineById(
    ctx.params.id,
  );
};

getMachineById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateMachineById = async (ctx: KoaContext<getMachineByIdResponse, IdParams>) => {
  ctx.body = await machineService.updateMachineById(ctx.params.id, ctx.request.body);
};

updateMachineById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    site_id: Joi.number().integer().positive(),
    product_id: Joi.number().integer().positive(),
    technieker_gebruiker_id: Joi.number().integer().positive(),
    code: Joi.string(),
    locatie: Joi.string(),
    status: Joi.string(),
    productie_status: Joi.string(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/machines',
  });

  router.get(
    '/', 
    requireAuthentication,
    validate(getAllMachines.validationScheme), 
    getAllMachines,
  );

  router.get(
    '/:id', 
    requireAuthentication,
    validate(getMachineById.validationScheme), 
    getMachineById,
  );

  router.put('/:id', 
    requireAuthentication,
    validate(updateMachineById.validationScheme),
    updateMachineById,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};