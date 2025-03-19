import Router from '@koa/router';
import * as machineService from '../service/machine';
import * as onderhoudService from '../service/onderhoud';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type { getMachineByIdResponse, getAllMachinesResponse, CreateMachineRequest, CreateMachineResponse } from '../types/machine';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

const getAllMachines = async (ctx: KoaContext<getAllMachinesResponse>) => {
  const machines = await machineService.getAllMachines();
  const onderhoud = await onderhoudService.getAllOnderhouden();
  ctx.body = {
    items: machines,
    onderhoud: onderhoud.items,
  };
};
getAllMachines.validationScheme = null;

const getMachineById = async (ctx: KoaContext<getMachineByIdResponse, IdParams>) => {
  ctx.body = await machineService.getMachineById(ctx.params.id);
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

const createMachine = async(ctx: KoaContext<CreateMachineResponse, void, CreateMachineRequest>) => {
  const newMachine = await machineService.createMachine(ctx.request.body);
  ctx.status = 201;
  ctx.body = newMachine;
};
createMachine.validationScheme = {
  body:{
    site_id: Joi.number().integer().positive().required(),
    product_id: Joi.number().integer().positive().required(),
    technieker_gebruiker_id: Joi.number().integer().positive().required(),
    code: Joi.string().max(255).required(),
    locatie: Joi.string().max(255).required(),
    status: Joi.string().valid('DRAAIT', 'MANUEEL_GESTOPT', 'AUTMATISCH_GESTOPT', 'IN_ONDERHOUD', 'AUTOMATISCH_GESTOPT', 'STARTBAAR').required(),
    productie_status: Joi.string().valid('GEZOND', 'NOOD_ONDERHOUD', 'FALEND').required(),
    product_informatie: Joi.string().allow('').optional(),
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

  router.put(
    '/:id', 
    requireAuthentication,
    validate(updateMachineById.validationScheme),
    updateMachineById,
  );
  
  router.post(
    '/',
    requireAuthentication,
    validate(createMachine.validationScheme),
    createMachine,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};