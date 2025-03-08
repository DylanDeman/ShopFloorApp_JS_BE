import Router from '@koa/router';
import * as siteService from '../service/site';
import type { KoaContext, KoaRouter, BudgetAppContext, BudgetAppState } from '../types/koa';
import validate from '../core/validation';
import type { getAllSitesResponse, UpdateSiteRequest, UpdateSiteResponse ,getSiteByIdResponse, CreateSiteResponse, CreateSiteRequest } from '../types/site';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import roles from '../core/roles';

const getAllSites = async (ctx: KoaContext<getAllSitesResponse>) => {
  const page = parseInt(ctx.query.page as string) || 0;
  const limit = parseInt(ctx.query.limit as string) || 0;

  const { items, total } = await siteService.getAllSites(page, limit);

  ctx.body = {
    items,
    total,
    totalPages: limit === 0 ? total : Math.ceil(total/limit),
    page,
    limit,
  };
};
getAllSites.validationScheme = {
  query: {
    page: Joi.number().min(0).optional().default(0),
    limit: Joi.number().min(0).optional().default(0),
  },
};

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

const updateById = async (ctx: KoaContext<UpdateSiteResponse, IdParams, UpdateSiteRequest>) => {
  const id = ctx.params.id;
  const data = ctx.request.body;

  const updatedSite = await siteService.updateSiteById(id, data);
  ctx.status = 200;
  ctx.body = updatedSite;
};
updateById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    naam: Joi.string().max(255),
    verantwoordelijke_id: Joi.number().integer().positive().required(),
    status: Joi.string().valid('ACTIEF', 'INACTIEF').required(),
  },
};

const createSite = async (ctx: KoaContext<CreateSiteResponse, void, CreateSiteRequest>) => {
  const newSite = await siteService.createSite(ctx.request.body);
  ctx.status = 201;
  ctx.body = newSite;
};
createSite.validationScheme = {
  body: {
    naam: Joi.string().max(255).required(),
    verantwoordelijke_id: Joi.number().integer().positive().required(),
    status: Joi.string().valid('ACTIEF', 'INACTIEF').required(),
  },
};

const deleteSiteById = async (ctx: KoaContext<void, IdParams>) => {
  const {id} = ctx.params;
  const deletedSite = await siteService.deleteSiteById(Number(id));
  ctx.status = 200;
  ctx.body = deletedSite;
};
deleteSiteById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

const requireManager = makeRequireRole(roles.MANAGER);

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/sites',
  });

  router.get(
    '/', 
    requireAuthentication,
    requireManager,
    validate(getAllSites.validationScheme), 
    getAllSites,
  );

  router.get(
    '/:id', 
    requireAuthentication,
    requireManager,
    validate(getSiteById.validationScheme), 
    getSiteById,
  );

  router.put(
    '/:id',
    requireAuthentication,
    requireManager,
    validate(updateById.validationScheme),
    updateById,
  );

  router.post(
    '/',
    requireAuthentication,
    requireManager,
    validate(createSite.validationScheme),
    createSite,
  );

  router.delete(
    '/:id',
    requireAuthentication,
    requireManager,
    validate(deleteSiteById.validationScheme),
    deleteSiteById,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};