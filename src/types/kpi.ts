import type { Entity, ListResponse } from './common';
import type { Prisma } from '@prisma/client';

export interface KPI extends Entity {
  onderwerp: string;
  roles: Prisma.JsonValue;
  grafiek: string;
}

export interface GetAllKPIsReponse extends ListResponse<KPI> { }
export interface GetKPIByIdResponse extends KPI { }
