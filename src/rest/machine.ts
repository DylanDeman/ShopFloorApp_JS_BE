import Router from '@koa/router';
import * as machineService from '../service/machine';
import type { KoaContext, KoaRouter, ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import validate from '../core/validation';
import type { 
  getMachineByIdResponse, 
  getAllMachinesResponse, 
  CreateMachineRequest, 
  CreateMachineResponse, 
} from '../types/machine';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import { makeRequireRoles, requireAuthentication } from '../core/auth';

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: API endpoints for managing machines
 */

/**
 * @swagger
 * /machines:
 *   get:
 *     summary: Get all machines
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of machines
 */
const getAllMachines = async (ctx: KoaContext<getAllMachinesResponse>) => {
  ctx.body = {
    items: await machineService.getAllMachines(ctx.state.session.userId, ctx.state.session.roles),
  };
};
getAllMachines.validationScheme = null;

/**
 * @swagger
 * /machines/{id}:
 *   put:
 *     summary: Update a machine by ID
 *     tags: [Machines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               site_id:
 *                 type: integer
 *               product_naam:
 *                 type: string
 *               technieker_gebruiker_id:
 *                 type: integer
 *               code:
 *                 type: string
 *               locatie:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAAIT, MANUEEL_GESTOPT, IN_ONDERHOUD, AUTOMATISCH_GESTOPT, STARTBAAR]
 *               productie_status:
 *                 type: string
 *                 enum: [GEZOND, NOOD_ONDERHOUD, FALEND]
 *               product_informatie:
 *                 type: string
 *     responses:
 *       200:
 *         description: Machine updated
 */
const updateMachineById = async (ctx: KoaContext<getMachineByIdResponse, IdParams>) => {
  ctx.body = await machineService.updateMachineById(ctx.params.id, ctx.request.body);
};

updateMachineById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body:{
    site_id: Joi.number().integer().positive().required(),
    product_naam: Joi.string(),
    product_informatie: Joi.string().allow('').optional(),
    technieker_id: Joi.number().integer().positive().required(),
    code: Joi.string().max(255).required(),
    locatie: Joi.string().max(255).required(),
    status: Joi.string().valid('DRAAIT', 'MANUEEL_GESTOPT', 
      'IN_ONDERHOUD', 'AUTOMATISCH_GESTOPT', 'STARTBAAR').required(),
    productie_status: Joi.string().valid('GEZOND', 'NOOD_ONDERHOUD', 'FALEND').required(),
    limiet_voor_onderhoud: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /machines/{id}:
 *   get:
 *     summary: Get machine by ID
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               site_id:
 *                 type: integer
 *               product_naam:
 *                 type: string
 *               technieker_gebruiker_id:
 *                 type: integer
 *               code:
 *                 type: string
 *               locatie:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAAIT, MANUEEL_GESTOPT, IN_ONDERHOUD, AUTOMATISCH_GESTOPT, STARTBAAR]
 *               productie_status:
 *                 type: string
 *                 enum: [GEZOND, NOOD_ONDERHOUD, FALEND]
 *               product_informatie:
 *                 type: string
 *     responses:
 *       200:
 *         description: Machine data
 */
const getMachineById = async (ctx: KoaContext<getMachineByIdResponse, IdParams>) => {
  ctx.body = await machineService.getMachineById(ctx.params.id);
};
getMachineById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /machines:
 *   post:
 *     summary: Create a new machine
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               site_id:
 *                 type: integer
 *               product_naam:
 *                 type: string
 *               technieker_gebruiker_id:
 *                 type: integer
 *               code:
 *                 type: string
 *               locatie:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAAIT, MANUEEL_GESTOPT, IN_ONDERHOUD, AUTOMATISCH_GESTOPT, STARTBAAR]
 *               productie_status:
 *                 type: string
 *                 enum: [GEZOND, NOOD_ONDERHOUD, FALEND]
 *               product_informatie:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created machine data
 */
const createMachine = async(ctx: KoaContext<CreateMachineResponse, void, CreateMachineRequest>) => {
  const newMachine = await machineService.createMachine(ctx.request.body);
  ctx.status = 201;
  ctx.body = newMachine;
};
createMachine.validationScheme = {
  body:{
    site_id: Joi.number().integer().positive().required(),
    technieker_id: Joi.number().integer().positive().required(),
    code: Joi.string().max(255).required(),
    locatie: Joi.string().max(255).required(),
    status: Joi.string().valid('DRAAIT', 'MANUEEL_GESTOPT', 
      'IN_ONDERHOUD', 'AUTOMATISCH_GESTOPT', 'STARTBAAR').required(),
    productie_status: Joi.string().valid('GEZOND', 'NOOD_ONDERHOUD', 'FALEND').required(),
    product_naam: Joi.string(),
    product_informatie: Joi.string().allow('').optional(),
    limiet_voor_onderhoud: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/machines',
  });

  const requireRoleManagerVwTech = makeRequireRoles(['MANAGER', 'VERANTWOORDELIJKE', 'TECHNIEKER']);
  const requireRoleVwTech = makeRequireRoles(['VERANTWOORDELIJKE', 'TECHNIEKER']);
  router.get(
    '/', 
    requireAuthentication, 
    requireRoleManagerVwTech,
    validate(getAllMachines.validationScheme),
    getAllMachines,
  );
  router.get(
    '/:id', 
    requireAuthentication,
    requireRoleManagerVwTech,
    validate(getMachineById.validationScheme),
    getMachineById,
  );
  
  router.post(
    '/',
    requireAuthentication,
    requireRoleVwTech, // Enkel Vw en Tech mag machine aanmaken
    validate(createMachine.validationScheme),
    createMachine,
  );

  router.put(
    '/:id', 
    requireAuthentication, 
    requireRoleVwTech, // Enkel Vw en Tech mag machine updaten
    validate(updateMachineById.validationScheme), 
    updateMachineById,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
