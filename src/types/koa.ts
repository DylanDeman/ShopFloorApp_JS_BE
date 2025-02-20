import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface BudgetAppState {
  session: SessionInfo;
}

export interface BudgetAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> =
  ParameterizedContext<
    BudgetAppState,
    BudgetAppContext<Params, RequestBody, Query>,
    ResponseBody
  >;

export interface KoaApplication extends Application<BudgetAppState, BudgetAppContext> {}

export interface KoaRouter extends Router<BudgetAppState, BudgetAppContext> {}