import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface KPIWaarde extends Entity {
  datum: Date,
  waarde: Prisma.JsonValue,
  site_id: string | null,
}

export interface GetAllKPIWaardenReponse extends ListResponse<KPIWaarde> { }
export interface GetKPIWaardeByIdResponse extends KPIWaarde { }
