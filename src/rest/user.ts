import type { Next } from 'koa';
import Router from '@koa/router';
import Joi from 'joi';
import * as userService from '../service/user';
import * as dashboardService from '../service/dashboard';
import type { getAllDashboardsResponse } from '../types/dashboard';
import type { ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};
getAllUsers.validationScheme = null;

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns an authentication token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - wachtwoord
 *             properties:
 *               adres_id:
 *                 type: integer
 *                 description: Address ID reference
 *               voornaam:
 *                 type: string
 *                 maxLength: 255
 *                 description: First name
 *               naam:
 *                 type: string
 *                 description: Last name
 *               geboortedatum:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               wachtwoord:
 *                 type: string
 *                 minLength: 12
 *                 maxLength: 255
 *                 description: Password (minimum 12 characters)
 *               gsm:
 *                 type: string
 *                 description: Mobile phone number
 *               rol:
 *                 type: string
 *                 description: User role
 *               status:
 *                 type: string
 *                 description: User account status
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by ID. Use 'me' to get current user's profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID or 'me' for current user
 *         schema:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *               enum: [me]
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Not allowed to access this user's information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: FORBIDDEN
 *                 message:
 *                   type: string
 *                   example: You are not allowed to view this user's information
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update user details for the specified user ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voornaam:
 *                 type: string
 *                 maxLength: 255
 *               naam:
 *                 type: string
 *                 maxLength: 255
 *               geboortedatum:
 *                 type: string
 *                 format: date
 *               wachtwoord:
 *                 type: string
 *                 minLength: 12
 *                 maxLength: 255
 *               gsm:
 *                 type: string
 *               rol:
 *                 type: string
 *               status:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Updated user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Not allowed to update this user's information
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete a user account by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       403:
 *         description: Forbidden - Not allowed to delete this user
 */
const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/users/{id}/dashboard:
 *   get:
 *     summary: Get dashboards by user ID
 *     description: Retrieve all dashboards for a specific user
 *     tags: [Users, Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user dashboards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *       403:
 *         description: Forbidden - Not allowed to view this user's dashboards
 */
const getDashboardByUserID = async (ctx: KoaContext<getAllDashboardsResponse, IdParams>) => {
  const dashboards = await dashboardService.getDashboardByUserID(ctx.params.id);

  ctx.body = {
    items: dashboards,
  };
};
getDashboardByUserID.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user
 *         voornaam:
 *           type: string
 *           description: First name
 *         naam:
 *           type: string
 *           description: Last name
 *         geboortedatum:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         gsm:
 *           type: string
 *           description: Mobile phone number
 *         rol:
 *           type: string
 *           description: User role
 *         status:
 *           type: string
 *           description: User account status
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * Install routes for user-related operations
 */
export default function installUserRoutes(parent: KoaRouter) {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({ prefix: '/users' });

  // Voor register is er geen authenticatie nodig
  router.post(
    '/',
    authDelay,
    validate(registerUser.validationScheme),
    registerUser,
  );
  
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

  router.get(
    '/:id/dashboard'
    , requireAuthentication,
    validate(getDashboardByUserID.validationScheme),
    checkUserId,
    getDashboardByUserID,
  );

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};