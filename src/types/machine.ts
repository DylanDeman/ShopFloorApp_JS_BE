import type { Entity, ListResponse } from './common';
import type { User } from './user';
import type { Site } from './site';

// Types voor REST LAAG
export interface Machine extends Entity {
  product_id: number;
  code: string;
  locatie: string;
  status: string;
  product_informatie: string;
  productie_status: string;
  technieker: Pick<User, 'id' |'voornaam' | 'naam'>;
  site: Pick<Site, 'id' | 'naam' | 'verantwoordelijke'>;
}

// Types voor SERVICE LAAG
export interface getAllMachinesResponse extends ListResponse<Machine> {};
export interface getMachineByIdResponse extends Machine {};