import type { Entity, ListResponse } from './common';

export interface SiteOverview extends Entity{
  naam: string;
  verantwoordelijke: string;
  aantalMachines: number;
}

export interface getAllSitesResponse extends ListResponse<SiteOverview>{}
export interface getSiteByIdResponse extends SiteOverview {}