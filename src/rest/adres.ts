import Router from '@koa/router';
import Joi from 'joi';
import * as adresService from '../service/adres';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateAdresRequest,
  CreateAdresResponse,
  GetAllAdressesReponse,
  GetAdresByIdResponse,
  UpdateAdresRequest,
  UpdateAdresResponse,
} from '../types/adres';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { makeRequireRoles, requireAuthentication } from '../core/auth';
import roles from '../core/roles';

/**
 * @swagger
 * /api/adres:
 *   get:
 *     summary: Get all addresses
 *     tags: [Adres]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all addresses
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
 *                       street:
 *                         type: string
 *                       number:
 *                         type: string
 *                       city:
 *                         type: string
 *                       postalcode:
 *                         type: string
 *                       land:
 *                         type: string
 */
const getAllAdresses = async (ctx: KoaContext<GetAllAdressesReponse>) => {
  ctx.body = {
    items: await adresService.getAll(),
  };
};
getAllAdresses.validationScheme = null;

/**
 * @swagger
 * /api/adres:
 *   post:
 *     summary: Create a new address
 *     tags: [Adres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               city:
 *                 type: string
 *               postalcode:
 *                 type: string
 *               land:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 street:
 *                   type: string
 *                 number:
 *                   type: string
 *                 city:
 *                   type: string
 *                 postalcode:
 *                   type: string
 *                 land:
 *                   type: string
 */
const createAdres = async (ctx: KoaContext<CreateAdresResponse, void, CreateAdresRequest>) => {
  const newAdres = await adresService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
  ctx.body = newAdres;
};
createAdres.validationScheme = {
  body: {
    street: Joi.string(),
    number: Joi.string(),
    city: Joi.string(),
    postalcode: Joi.string(),
    land: Joi.string(),
  },
};

/**
 * @swagger
 * /api/adres/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Adres]
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
 *         description: Address details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 street:
 *                   type: string
 *                 number:
 *                   type: string
 *                 city:
 *                   type: string
 *                 postalcode:
 *                   type: string
 *                 land:
 *                   type: string
 */
const getAdresById = async (ctx: KoaContext<GetAdresByIdResponse, IdParams>) => {
  ctx.body = await adresService.getById(ctx.params.id);
};
getAdresById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/adres/{id}:
 *   put:
 *     summary: Update address by ID
 *     tags: [Adres]
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
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               city:
 *                 type: string
 *               postalcode:
 *                 type: string
 *               land:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 street:
 *                   type: string
 *                 number:
 *                   type: string
 *                 city:
 *                   type: string
 *                 postalcode:
 *                   type: string
 *                 land:
 *                   type: string
 */
const updateAdres = async (ctx: KoaContext<UpdateAdresResponse, IdParams, UpdateAdresRequest>) => {
  const updatedAdres = await adresService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });

  ctx.body = { id: ctx.params.id, ...updatedAdres };
};
updateAdres.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    street: Joi.string(),
    number: Joi.string(),
    city: Joi.string(),
    postalcode: Joi.string(),
    land: Joi.string(),
  },
};

/**
 * @swagger
 * /api/adres/{id}:
 *   delete:
 *     summary: Delete address by ID
 *     tags: [Adres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Address successfully deleted
 */
const deleteAdres = async (ctx: KoaContext<void, IdParams>) => {
  await adresService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteAdres.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install routes for adres-related operations
 */
export default function installAdresRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/adres',
  });

  router.use(requireAuthentication);
  const requireAdmin = makeRequireRoles([roles.ADMINISTRATOR]);

  router.get(
    '/', 
    requireAdmin,
    validate(getAllAdresses.validationScheme), 
    getAllAdresses,
  );
  router.post(
    '/', 
    requireAdmin,
    validate(createAdres.validationScheme), 
    createAdres,
  );
  router.get(
    '/:id', 
    requireAdmin,
    validate(getAdresById.validationScheme), 
    getAdresById,
  );
  router.put(
    '/:id', 
    requireAdmin,
    validate(updateAdres.validationScheme), 
    updateAdres,
  );
  router.delete(
    '/:id', 
    requireAdmin,
    validate(deleteAdres.validationScheme), 
    deleteAdres,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
