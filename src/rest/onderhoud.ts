import Router from '@koa/router';
import * as onderhoudService from '../service/onderhoud';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';
import type { 
  CreateOnderhoudRequest, 
  CreateOnderhoudResponse, 
  GetAllOnderhoudenReponse, 
  GetOnderhoudByIdResponse, 
} from '../types/onderhoud';
import type { IdParams } from '../types/common';
import Joi from 'joi';

/**
 * @swagger
 * /api/onderhouden:
 *   get:
 *     summary: Get all onderhoud records
 *     tags: [Onderhoud]
 *     responses:
 *       200:
 *         description: List of onderhoud records
 */
const getAllOnderhouden = async (ctx: KoaContext<GetAllOnderhoudenReponse>) => {
  const onderhouden = await onderhoudService.getAllOnderhouden();
  ctx.body = {
    items: onderhouden,
  };
};
getAllOnderhouden.validationScheme = null;

/**
 * @swagger
 * /api/onderhouden/{id}:
 *   get:
 *     summary: Get onderhoud by ID
 *     tags: [Onderhoud]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Onderhoud details by ID
 */
const getOnderhoudById = async (ctx: KoaContext<GetOnderhoudByIdResponse, IdParams>) => {
  ctx.body = await onderhoudService.getOnderhoudById(ctx.params.id);
};
getOnderhoudById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/onderhouden:
 *   post:
 *     summary: Create a new onderhoud record
 *     tags: [Onderhoud]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machine_id:
 *                 type: integer
 *               technieker_gebruiker_id:
 *                 type: integer
 *               datum:
 *                 type: string
 *                 format: date
 *               starttijdstip:
 *                 type: string
 *                 format: date-time
 *               eindtijdstip:
 *                 type: string
 *                 format: date-time
 *               reden:
 *                 type: string
 *               status:
 *                 type: string
 *               opmerkingen:
 *                 type: string
 *     responses:
 *       201:
 *         description: Onderhoud record created
 */
const createOnderhoud = async (ctx: KoaContext<CreateOnderhoudResponse, void, CreateOnderhoudRequest>) => {
  const newOnderhoud = await onderhoudService.createOnderhoud(ctx.request.body);
  ctx.status = 201;
  ctx.body = newOnderhoud;
};
createOnderhoud.validationScheme = {
  body: {
    machine_id: Joi.number().integer().positive(),
    technieker_id: Joi.number().integer().positive(),
    datum: Joi.date(),
    starttijdstip: Joi.date(),
    eindtijdstip: Joi.date(),
    reden: Joi.string(),
    status: Joi.string(),
    opmerkingen: Joi.string(),
  },
};

/**
 * @swagger
 * /api/onderhouden/{id}:
 *   put:
 *     summary: Update onderhoud by ID
 *     tags: [Onderhoud]
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
 *               machine_id:
 *                 type: integer
 *               technieker_id:
 *                 type: integer
 *               datum:
 *                 type: string
 *                 format: date
 *               starttijdstip:
 *                 type: string
 *                 format: date-time
 *               eindtijdstip:
 *                 type: string
 *                 format: date-time
 *               reden:
 *                 type: string
 *               status:
 *                 type: string
 *               opmerkingen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Onderhoud record updated
 */
const updateOnderhoudById = async (ctx: KoaContext<GetOnderhoudByIdResponse, IdParams>) => {
  ctx.body = await onderhoudService.updateOnderhoudById(ctx.params.id, ctx.request.body);
};

updateOnderhoudById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    machine_id: Joi.number().integer().positive(),
    technieker_id: Joi.number().integer().positive(),
    datum: Joi.date(),
    starttijdstip: Joi.date(),
    eindtijdstip: Joi.date(),
    reden: Joi.string(),
    status: Joi.string(),
    opmerkingen: Joi.string(),
  },
};

/**
 * @swagger
 * /api/onderhouden/{id}:
 *   delete:
 *     summary: Delete onderhoud by ID
 *     tags: [Onderhoud]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Onderhoud record deleted
 */
const deleteOnderhoud = async (ctx: KoaContext<void, IdParams>) => {
  await onderhoudService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteOnderhoud.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default function installOnderhoudRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/onderhouden',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllOnderhouden.validationScheme), getAllOnderhouden);

  router.get('/:id', validate(getOnderhoudById.validationScheme), getOnderhoudById);

  router.put('/:id', validate(updateOnderhoudById.validationScheme), updateOnderhoudById);

  router.post('/', validate(createOnderhoud.validationScheme), createOnderhoud);

  router.delete('/:id', validate(deleteOnderhoud.validationScheme), deleteOnderhoud);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
