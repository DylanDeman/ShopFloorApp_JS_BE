import type { Entity, ListResponse } from './common';

export interface Machine extends Entity{
  site_id: number;
  product_id: number;
  technieker_gebruiker_id: number;
  code: string;
  locatie: string;
  status: string;
  productie_status: string;
}

export interface getAllMachinesResponse extends ListResponse<Machine> {
  items: Machine[]; 
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface getMachineByIdResponse extends Machine {};