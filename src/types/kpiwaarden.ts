import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface KPIWaarde extends Entity {
  datum: Date,
  waarde: Prisma.JsonValue,
}

export interface GetAllKPIWaardenReponse extends ListResponse<KPIWaarde> { }
export interface GetKPIWaardeByIdResponse extends KPIWaarde { }
