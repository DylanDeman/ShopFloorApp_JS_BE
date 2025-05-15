import type { Entity, ListResponse } from './common';
import type { User } from './user';
import type { Site } from './site';
import type { Onderhoud } from './onderhoud';

// Types voor SERVICE-LAAG
export interface Machine extends Entity {
  code: string;
  location: string;
  machinestatus: string;
  lastmaintenance: Date;
  productionstatus: string;
  aantal_goede_producten: number;
  aantal_slechte_producten: number;
  limiet_voor_onderhoud: number;
  technieker: Pick<User, 'id' |'firstname' | 'lastname'>;
  product_naam: string;
  productinfo: string;
  site: Pick<Site, 'id' | 'sitename' | 'verantwoordelijke'>;
  onderhouden: Onderhoud[];
}

// Velden die nodig zijn om een machine aan te maken:
export interface MachineCreateInput {
  code: string;
  machinestatus?: string;
  productionstatus?: string;
  location: string;
  technician_id: number;
  site_id: number;
  limiet_voor_onderhoud: number;
  product_naam: string;
  productinfo: string;
};

export interface MachineUpdateInput extends MachineCreateInput {};

// Types voor REST-LAAG
export interface getAllMachinesResponse extends ListResponse<Machine> {};
export interface getMachineByIdResponse extends Machine {};

export interface CreateMachineRequest extends MachineCreateInput {};
export interface CreateMachineResponse extends getMachineByIdResponse {};
