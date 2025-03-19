import Router from '@koa/router';
import Joi from 'joi';
import * as kpiwaardenService from '../service/kpiwaarden';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  GetAllKPIWaardenReponse,
  GetKPIWaardeByIdResponse,
} from '../types/kpiwaarden';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllKPIWaarden = async (ctx: KoaContext<GetAllKPIWaardenReponse>) => {
  ctx.body = {
    items: await kpiwaardenService.getAll(
    ),
  };
};
getAllKPIWaarden.validationScheme = null;

const getKPIWaardeById = async (ctx: KoaContext<GetKPIWaardeByIdResponse, IdParams>) => {
  ctx.body = await kpiwaardenService.getById(
    ctx.params.id,
  );
};
getKPIWaardeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default function installKPIWaardenRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/kpiwaarden',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllKPIWaarden.validationScheme), getAllKPIWaarden);
  router.get('/:id', validate(getKPIWaardeById.validationScheme), getKPIWaardeById);

  parent.use(router.routes())
    .use(router.allowedMethods());
};