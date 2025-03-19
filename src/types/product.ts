import type { Entity, ListResponse } from "./common";
import { Machine } from "./machine";


export interface Product extends Entity{
naam: string,
machines?: Machine[];
}


export interface GetAllProductResponse extends ListResponse<Product> {}
export interface GetProductByIdResponse {
  product: Product | null;
}
