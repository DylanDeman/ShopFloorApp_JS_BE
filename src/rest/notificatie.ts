import Router from '@koa/router';
import * as notificatieService from '../service/notificatie';
import type { KoaContext, KoaRouter, ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import validate from '../core/validation';
import type {GetAllNotificatiesResponse, GetNotificatieByIdResponse, 
  CreateNotificatieRequest, CreateNotificatieResponse} from '../types/notificatie';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

/**
 * @swagger
 * /api/notificaties:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notificaties]
 *     responses:
 *       200:
 *         description: List of notifications
 */
const getAllNotificaties = async (ctx: KoaContext<GetAllNotificatiesResponse>) => {
  const { items, total } = await notificatieService.getAllNotificaties();
  ctx.body = {
    items,
    total,
  };
};
getAllNotificaties.validationScheme = null;

/**
 * @swagger
 * /api/notificaties/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notificaties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification details
 */
const getNotificatieById = async (ctx: KoaContext<GetNotificatieByIdResponse, IdParams>) => {
  ctx.body = await notificatieService.getNotificatieById(
    ctx.params.id,
  );
};
getNotificatieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/notificaties:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notificaties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bericht:
 *                 type: string
 *               tijdstip:
 *                 type: string
 *                 format: date-time
 *               gelezen:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notification created
 */
const createNotificatie = async (ctx: KoaContext<CreateNotificatieResponse, void, CreateNotificatieRequest>) => {
  const newNotificatie = await notificatieService.createNotificatie(ctx.request.body);
  ctx.status = 201;
  ctx.body = newNotificatie;
};
createNotificatie.validationScheme = {
  body: {
    bericht: Joi.string(),
    tijdstip: Joi.date(),
    gelezen: Joi.bool().optional().default(false),
  },
};

/**
 * @swagger
 * /api/notificaties/{id}:
 *   put:
 *     summary: Update a notification by ID
 *     tags: [Notificaties]
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
 *               bericht:
 *                 type: string
 *               tijdstip:
 *                 type: string
 *                 format: date-time
 *               gelezen:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification updated
 */
const updateNotificatieById = async (ctx: KoaContext<GetNotificatieByIdResponse, IdParams>) => {
  ctx.body = await notificatieService.updateNotificatieById(ctx.params.id, ctx.request.body);
};
updateNotificatieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    tijdstip: Joi.date(),
    bericht: Joi.string(),
    gelezen: Joi.bool(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
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

  router.put(
    '/:id',
    requireAuthentication,
    validate(updateNotificatieById.validationScheme),
    updateNotificatieById,
  );

  router.post(
    '/',
    requireAuthentication,
    validate(createNotificatie.validationScheme),
    createNotificatie,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
