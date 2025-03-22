import Router from '@koa/router';
import * as productService from '../service/product';
import type { KoaContext, KoaRouter, ShopfloorAppContext, ShopfloorAppState } from '../types/koa';
import Joi from 'joi';

import type { GetAllProductResponse, GetProductByIdResponse } from '../types/product';
import type { IdParams } from '../types/common';
import validate from '../core/validation';

const getAllProducts = async(ctx: KoaContext<GetAllProductResponse>) => {
  const producten = await productService.getAllProducts();
  ctx.status = 200;
  ctx.body = {
    items: producten,
  };
};
getAllProducts.validationScheme = null;

const getProductById = async(ctx: KoaContext<GetProductByIdResponse, IdParams>) => {
  const {id} = ctx.params;
  const product = await productService.getProductById(Number(id));
  ctx.status = 200;
  ctx.body = {id: product!.id, naam: product!.naam, product_informatie: product!.product_informatie};
};
getProductById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<ShopfloorAppState, ShopfloorAppContext>({
    prefix: '/producten',
  });

  router.get(
    '/',
    validate(getAllProducts.validationScheme),
    getAllProducts,
  );

  router.get(
    '/:id',
    validate(getProductById.validationScheme),
    getProductById,
  );

  parent.use(router.routes()).use(router.allowedMethods());

};
