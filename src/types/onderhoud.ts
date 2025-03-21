import type { Entity, ListResponse } from './common';
import type { Onderhoud_Status } from '@prisma/client';
import type { User } from './user';

// Types voor SERVICE LAAG
export interface Onderhoud extends Entity {
  machine_id: number;
  datum: Date;
  starttijdstip: Date;
  eindtijdstip: Date;
  reden: string;
  status: Onderhoud_Status;
  opmerkingen: string;
  technieker: Pick<User, 'id' | 'voornaam' | 'naam'>;
}

export interface OnderhoudCreateInput {
  machine_id: number;
  technieker_id: number;
  datum: Date;
  starttijdstip: Date;
  eindtijdstip: Date;
  reden: string;
  status: Onderhoud_Status;
  opmerkingen: string;
};

// Types voor REST LAAG
export interface GetAllOnderhoudenReponse extends ListResponse<Onderhoud> { }
export interface GetOnderhoudByIdResponse extends Onderhoud {};

export interface CreateOnderhoudRequest extends OnderhoudCreateInput{};
export interface CreateOnderhoudResponse extends GetOnderhoudByIdResponse{};