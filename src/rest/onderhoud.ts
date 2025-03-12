import Router from '@koa/router';
import * as onderhoudService from '../service/onderhoud';
import type { BudgetAppContext, BudgetAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';
import type { GetAllOnderhoudenReponse } from '../types/onderhoud';

const getAllOnderhouden = async (ctx: KoaContext<GetAllOnderhoudenReponse>) => {
  ctx.body = {
    items: await onderhoudService.getAll(
    ),
  };
};
getAllOnderhouden.validationScheme = null;

export default function installOnderhoudRoutes(parent: KoaRouter) {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/onderhouden',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllOnderhouden.validationScheme), getAllOnderhouden);

  parent.use(router.routes())
    .use(router.allowedMethods());
};