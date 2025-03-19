import Router from '@koa/router';
import Joi from 'joi';
import * as kpiService from '../service/kpi';
import * as kpiwaardenService from '../service/kpiwaarden';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  GetAllKPIsReponse,
  GetKPIByIdResponse,
} from '../types/kpi';
import type {
  GetAllKPIWaardenReponse,
} from '../types/kpiwaarden';
import type { IdParams, RoleParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllKPIs = async (ctx: KoaContext<GetAllKPIsReponse>) => {
  ctx.body = {
    items: await kpiService.getAll(
    ),
  };
};
getAllKPIs.validationScheme = null;

const getKPIById = async (ctx: KoaContext<GetKPIByIdResponse, IdParams>) => {
  ctx.body = await kpiService.getById(
    ctx.params.id,
  );
};
getKPIById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const deleteKPI = async (ctx: KoaContext<void, IdParams>) => {
  await kpiService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteKPI.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getKPIWaardenByKPIid = async (ctx: KoaContext<GetAllKPIWaardenReponse, IdParams>) => {
  const kpiwaarden = await kpiwaardenService.getKPIWaardenByKPIid(ctx.params.id);
  ctx.body = {
    items: kpiwaarden,
  };
};
getKPIWaardenByKPIid.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getKPIByRole = async (ctx: KoaContext<GetAllKPIsReponse, RoleParams>) => {
  const kpis = await kpiService.getKPIByRole(ctx.params.role);
  ctx.body = {
    items: kpis,
  };
};
getKPIByRole.validationScheme = {
  params: {
    role: Joi.string().valid('ADMINISTRATOR', 'MANAGER', 'VERANTWOORDELIJKE', 'TECHNIEKER').required(),
  },
};

export default function installKPIRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/kpi',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllKPIs.validationScheme), getAllKPIs);
  router.get('/:id', validate(getKPIById.validationScheme), getKPIById);
  router.get('/:id/kpiwaarden', validate(getKPIWaardenByKPIid.validationScheme), getKPIWaardenByKPIid);
  router.delete('/:id', validate(deleteKPI.validationScheme), deleteKPI);
  router.get('/rol/:role', validate(getKPIByRole.validationScheme), getKPIByRole);

  parent.use(router.routes())
    .use(router.allowedMethods());
};