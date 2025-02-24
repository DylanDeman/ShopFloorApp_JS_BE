import type { Next } from 'koa';
import Router from '@koa/router';
import Joi from 'joi';
import * as userService from '../service/user';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  LoginResponse,
  GetUserRequest,
} from '../types/user';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication, authDelay } from '../core/auth';

const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== 'me' && id !== userId) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};
getAllUsers.validationScheme = null;

const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterUserRequest>) => {
  const token = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};
registerUser.validationScheme = {
  body: {
    adres_id: Joi.number().integer().positive(),
    voornaam: Joi.string().max(255),
    naam: Joi.string(),
    geboortedatum: Joi.date(),
    email: Joi.string().email(),
    wachtwoord: Joi.string().min(12).max(255),
    gsm: Joi.string(),
    rol: Joi.string(),
    status: Joi.string(),
  },
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ),
  },
};

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    voornaam: Joi.string().max(255),
    geboortedatum: Joi.date(),
    wachtwoord: Joi.string().min(12).max(255),
    gsm: Joi.string(),
    rol: Joi.string(),
    status: Joi.string(),
    naam: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default function installUserRoutes (parent: KoaRouter) {
  const router = new Router<BudgetAppState, BudgetAppContext>({ prefix: '/users' });

  router.post(
    '/',
    authDelay,
    validate(registerUser.validationScheme),
    registerUser,
  );;

  router.get(
    '/',
    requireAuthentication,
    validate(getAllUsers.validationScheme),
    getAllUsers,
  );
  router.get(
    '/:id',
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById,
  );
  router.put(
    '/:id',
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById,
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById,
  );

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};