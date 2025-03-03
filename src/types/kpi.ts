import type { Entity, ListResponse } from './common';

export interface KPI extends Entity {
  onderwerp: string;
}

export interface GetAllKPIsReponse extends ListResponse<KPI> {}
export interface GetKPIByIdResponse extends KPI {}
