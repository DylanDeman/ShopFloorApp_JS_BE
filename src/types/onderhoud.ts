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
  opmerking: string;
}

export interface GetAllOnderhoudenReponse extends ListResponse<Onderhoud> { }
