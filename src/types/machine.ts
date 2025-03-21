import type { Entity, ListResponse } from './common';
import type { User } from './user';
import type { Site } from './site';
import type { Onderhoud } from './onderhoud';
import type { Product } from './product';

// Types voor SERVICE-LAAG
export interface Machine extends Entity {
  code: string;
  locatie: string;
  status: string;
  status_sinds: Date;
  productie_status: string;
  aantal_goede_producten: number;
  aantal_slechte_producten: number;
  limiet_voor_onderhoud: number;
  technieker: Pick<User, 'id' |'voornaam' | 'naam'>;
  product: Pick<Product, 'id' | 'naam' | 'product_informatie'>;
  site: Pick<Site, 'id' | 'naam' | 'verantwoordelijke'>;
  onderhouden: Onderhoud[];
}

// Velden die nodig zijn om een machine aan te maken:
export interface MachineCreateInput {
  code: string;
  status?: string;
  productie_status?: string;
  locatie: string;
  technieker_id: number;
  site_id: number;
  product_id: number;
  limiet_voor_onderhoud: number;
};

export interface MachineUpdateInput extends MachineCreateInput {};

// Types voor REST-LAAG
export interface getAllMachinesResponse extends ListResponse<Machine> {};
export interface getMachineByIdResponse extends Machine {};

export interface CreateMachineRequest extends MachineCreateInput {};
export interface CreateMachineResponse extends getMachineByIdResponse {};
