import type { Entity, ListResponse } from './common';
import type { Machine } from './machine';

export interface Product extends Entity{
  naam: string,
  product_informatie: string,
  machines?: Machine[];
}

export interface GetAllProductResponse extends ListResponse<Product> {}
export interface GetProductByIdResponse extends Product {}
