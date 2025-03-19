import Router from '@koa/router';
import Joi from 'joi';
import * as adresService from '../service/adres';
import type { ShopfloorAppContext, ShopfloorAppState} from '../types/koa';
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
import { requireAuthentication } from '../core/auth';

const getAllAdresses = async (ctx: KoaContext<GetAllAdressesReponse>) => {
  ctx.body = {
    items: await adresService.getAll(
    ),
  };
};
getAllAdresses.validationScheme = null;

const createAdres = async (ctx: KoaContext<CreateAdresResponse, void, CreateAdresRequest>) => {
  const newAdres = await adresService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
  ctx.body = newAdres;
};
createAdres.validationScheme = {
  body: {
    straat: Joi.string(),
    huisnummer: Joi.string(),
    stadsnaam: Joi.string(),
    postcode: Joi.string(),
    land: Joi.string(),
  },
};

const getAdresById = async (ctx: KoaContext<GetAdresByIdResponse, IdParams>) => {
  ctx.body = await adresService.getById(
    ctx.params.id,
  );
};
getAdresById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateAdres = async (ctx: KoaContext<UpdateAdresResponse, IdParams, UpdateAdresRequest>) => {
  const updatedAdres = await adresService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
  
  ctx.body = { id: ctx.params.id, ...updatedAdres };
};
updateAdres.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    straat: Joi.string(),
    huisnummer: Joi.string(),
    stadsnaam: Joi.string(),
    postcode: Joi.string(),
    land: Joi.string(),
  },
};

const deleteAdres = async (ctx: KoaContext<void, IdParams>) => {
  await adresService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteAdres.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default function installAdresRoutes (parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/adres',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllAdresses.validationScheme), getAllAdresses);
  router.post('/', validate(createAdres.validationScheme), createAdres);
  router.get('/:id', validate(getAdresById.validationScheme), getAdresById);
  router.put('/:id', validate(updateAdres.validationScheme), updateAdres);
  router.delete('/:id', validate(deleteAdres.validationScheme), deleteAdres);

  parent.use(router.routes())
    .use(router.allowedMethods());
};