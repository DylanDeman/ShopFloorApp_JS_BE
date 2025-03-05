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

const updateById = async (ctx: KoaContext<UpdateSiteResponse, IdParams, UpdateSiteRequest>) => {
  const id = ctx.params.id;
  const data = ctx.request.body;

  const updatedSite = await siteService.updateSiteById(id, data);
  ctx.status = 200;
  ctx.body = updatedSite
};
updateById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    naam: Joi.string().max(255).required(),
    verantwoordelijke_id: Joi.number().integer().positive().required(),
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
    getAllSites
  );


  router.get(
    '/:id', 
    requireAuthentication,
    requireManager,
    validate(getSiteById.validationScheme), 
    getSiteById
  );


  router.put(
    '/:id',
    requireAuthentication,
    requireManager,
    validate(updateById.validationScheme),
    updateById
  );

  router.post(
    "/",
    requireAuthentication,
    requireManager,
    validate(createSite.validationScheme),
    createSite
  );

  router.put(
    '/:id/delete',
    requireAuthentication,
    requireManager,
    validate(deleteSiteById.validationScheme),
    deleteSiteById
  );

  parent.use(router.routes()).use(router.allowedMethods());
};