import type { Entity, ListResponse } from './common';
import type { User } from './user';
import type { Site } from './site';
import type { Onderhoud } from './onderhoud';
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
export interface getAllMachinesResponse extends ListResponse<Machine> {
  onderhoud: Onderhoud[]
};
export interface getMachineByIdResponse extends Machine {};

export interface CreateMachineResponse extends getMachineByIdResponse {};
export interface CreateMachineRequest {
  site_id: number;
  product_id: number;
  technieker_gebruiker_id: number;
  code: string;
  locatie: string;
  status: 'DRAAIT' | 'MANUEEL_GESTOPT' | 'AUTOMATISCH_GESTOPT' | 'IN_ONDERHOUD' | 'STARTBAAR';
  productie_status: 'GEZOND' | 'NOOD_ONDERHOUD' | 'FALEND';
  product_informatie: string;
}
