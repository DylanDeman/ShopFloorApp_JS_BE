import Router from '@koa/router';
import * as siteService from '../service/site';
import type { KoaContext, KoaRouter, ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import validate from '../core/validation';
import type { 
  GetAllSitesResponse, 
  UpdateSiteRequest, 
  UpdateSiteResponse,
  GetSiteByIdResponse, 
  CreateSiteResponse, 
  CreateSiteRequest, 
} from '../types/site';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import roles from '../core/roles';

/**
 * @swagger
 * tags:
 *   name: Sites
 *   description: API endpoints for managing sites
 */

/**
 * @swagger
 * /api/sites:
 *   get:
 *     summary: Get all sites
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sites
 */
const getAllSites = async (ctx: KoaContext<GetAllSitesResponse>) => {
  ctx.body = {
    items: await siteService.getAllSites(),
  };
};
getAllSites.validationScheme = null;

/**
 * @swagger
 * /api/sites/{id}:
 *   get:
 *     summary: Get site by ID
 *     tags: [Sites]
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
 *         description: Site data
 */
const getSiteById = async (ctx: KoaContext<GetSiteByIdResponse, IdParams>) => {
  ctx.body = await siteService.getSiteById(ctx.params.id);
};
getSiteById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/sites/{id}:
 *   put:
 *     summary: Update site by ID
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naam:
 *                 type: string
 *               verantwoordelijke_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ACTIEF, INACTIEF]
 *     responses:
 *       200:
 *         description: Updated site data
 */
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

/**
 * @swagger
 * /api/sites:
 *   post:
 *     summary: Create a new site
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naam:
 *                 type: string
 *               verantwoordelijke_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ACTIEF, INACTIEF]
 *     responses:
 *       201:
 *         description: Created site data
 */
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

/**
 * @swagger
 * /api/sites/{id}:
 *   delete:
 *     summary: Delete site by ID
 *     tags: [Sites]
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
 *         description: Deleted site data
 */
const deleteSiteById = async (ctx: KoaContext<void, IdParams>) => {
  const { id } = ctx.params;
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
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/sites',
  });

  router.get('/', requireAuthentication, requireManager, validate(getAllSites.validationScheme), getAllSites);
  router.get('/:id', requireAuthentication, requireManager, validate(getSiteById.validationScheme), getSiteById);
  router.put('/:id', requireAuthentication, requireManager, validate(updateById.validationScheme), updateById);
  router.post('/', requireAuthentication, requireManager, validate(createSite.validationScheme), createSite);
  router.delete('/:id', requireAuthentication, requireManager, validate(deleteSiteById.validationScheme), deleteSiteById);

  parent.use(router.routes()).use(router.allowedMethods());
};
