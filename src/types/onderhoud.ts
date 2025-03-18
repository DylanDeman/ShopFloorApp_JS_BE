import type { Entity, ListResponse } from './common';
import type { Onderhoud_Status } from '@prisma/client';

export interface Onderhoud extends Entity {
  machine_id: number;
  technieker_gebruiker_id: number;
  datum: Date;
  starttijdstip: Date;
  eindtijdstip: Date;
  reden: string;
  status: Onderhoud_Status;
  opmerkingen: string;
}

export interface OnderhoudCreateInput extends Omit<Onderhoud, 'id'> {};

export interface GetAllOnderhoudenReponse extends ListResponse<Onderhoud> { }

export interface GetOnderhoudByIdResponse extends Onderhoud {};

export interface CreateOnderhoudRequest extends OnderhoudCreateInput{};
export interface CreateOnderhoudResponse extends GetOnderhoudByIdResponse{};