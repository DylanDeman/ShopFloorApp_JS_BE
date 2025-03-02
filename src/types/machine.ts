import type { Entity } from './common';

export interface Machine extends Entity{
  site_id: number;
  product_id: number;
  technieker_gebruiker_id: number;
  code: string;
  locatie: string;
  status: string;
  productie_status: string;

}