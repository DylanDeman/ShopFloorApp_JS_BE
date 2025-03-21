import Router from '@koa/router';
import * as notificatieService from '../service/notificatie';
import type { KoaContext, KoaRouter, ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import validate from '../core/validation';
import type {GetAllNotificatiesResponse, GetNotificatieByIdResponse, 
  CreateNotificatieRequest, CreateNotificatieResponse} from '../types/notificatie';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { requireAuthentication } from '../core/auth';

const getAllNotificaties = async (ctx: KoaContext<GetAllNotificatiesResponse>) => {
  const { items, total } = await notificatieService.getAllNotificaties();
  ctx.body = {
    items,
    total,
  };
};
getAllNotificaties.validationScheme = null;

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