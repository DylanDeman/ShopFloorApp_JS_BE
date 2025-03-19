import type { Entity, ListResponse } from './common';
import type { Machine } from './machine';

export interface Product extends Entity{
  product_informatie: string,
  machines?: Machine[];
}

export interface GetAllProductResponse extends ListResponse<Product> {}
export interface GetProductByIdResponse {
  product: Product | null;
}
