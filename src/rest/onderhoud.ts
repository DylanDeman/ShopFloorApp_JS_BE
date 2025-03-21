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

const getAllOnderhouden = async (ctx: KoaContext<GetAllOnderhoudenReponse>) => {
  const onderhouden = await onderhoudService.getAllOnderhouden();
  ctx.body = {
    items: onderhouden,
  };
};
getAllOnderhouden.validationScheme = null;

const getOnderhoudById = async (ctx: KoaContext<GetOnderhoudByIdResponse, IdParams>) => {
  ctx.body = await onderhoudService.getOnderhoudById(ctx.params.id);
};
getOnderhoudById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createOnderhoud = async (ctx: KoaContext<CreateOnderhoudResponse, void, CreateOnderhoudRequest>) => {
  const newOnderhoud = await onderhoudService.createOnderhoud(ctx.request.body);
  ctx.status = 201;
  ctx.body = newOnderhoud;
};
createOnderhoud.validationScheme = {
  body: {
    machine_id: Joi.number().integer().positive(),
    technieker_gebruiker_id: Joi.number().integer().positive(),
    datum: Joi.date(),
    starttijdstip: Joi.date(),
    eindtijdstip: Joi.date(),
    reden: Joi.string(),
    status: Joi.string(),
    opmerkingen: Joi.string(),
  },
};

export default function installOnderhoudRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/onderhouden',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllOnderhouden.validationScheme), getAllOnderhouden);

  router.get('/:id', validate(getOnderhoudById.validationScheme), getOnderhoudById);

  router.post('/', validate(createOnderhoud.validationScheme), createOnderhoud);

  parent.use(router.routes())
    .use(router.allowedMethods());
};

