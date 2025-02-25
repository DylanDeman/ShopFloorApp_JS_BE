import Router from '@koa/router';
import * as siteService from '../service/site';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type { getAllSitesResponse } from '../types/site';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type { getSiteByIdResponse } from '../types/site';
import { requireAuthentication } from '../core/auth';

const getAllSites = async (ctx: KoaContext<getAllSitesResponse>) => {
  ctx.body = {
    items: await siteService.getAllSites(),
  };
};
getAllSites.validationScheme = null;

const getSiteById = async (ctx: KoaContext<getSiteByIdResponse, IdParams>) => {
  ctx.body = await siteService.getSiteById(
    ctx.params.id,
  );
};

getSiteById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/sites',
  });

  router.get(
    '/', 
    requireAuthentication,
    validate(getAllSites.validationScheme), 
    getAllSites
  );

  router.get(
    '/:id', 
    requireAuthentication,
    validate(getSiteById.validationScheme), 
    getSiteById
  );

  parent.use(router.routes()).use(router.allowedMethods());
};