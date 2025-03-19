import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface ShopfloorAppState {
  session: SessionInfo;
}

export interface ShopfloorAppContext<
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
    ShopfloorAppState,
    ShopfloorAppContext<Params, RequestBody, Query>,
    ResponseBody
  >;

export interface KoaApplication extends Application<ShopfloorAppState, ShopfloorAppContext> {}

export interface KoaRouter extends Router<ShopfloorAppState, ShopfloorAppContext> {}