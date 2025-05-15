import type { Entity, ListResponse } from './common';
import type { Onderhoud_Status } from '@prisma/client';
import type { User } from './user';

// Types voor SERVICE LAAG
export interface Onderhoud extends Entity {
  machine_id: number;
  executiondate: Date;
  startdate: Date;
  enddate: Date;
  reason: string;
  status: Onderhoud_Status;
  comments: string;
  technieker: Pick<User, 'id' | 'firstname' | 'lastname'>;
}

export interface OnderhoudCreateInput {
  machine_id: number;
  technician_id: number;
  executiondate: Date;
  startdate: Date;
  enddate: Date;
  reason: string;
  status: Onderhoud_Status;
  comments: string;
};

// Types voor REST LAAG
export interface GetAllOnderhoudenReponse extends ListResponse<Onderhoud> { }
export interface GetOnderhoudByIdResponse extends Onderhoud {};

export interface CreateOnderhoudRequest extends OnderhoudCreateInput{};
export interface CreateOnderhoudResponse extends GetOnderhoudByIdResponse{};