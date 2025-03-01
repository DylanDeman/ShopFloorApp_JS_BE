import type { Entity, ListResponse } from './common';

export interface SiteOverview extends Entity{
  naam: string;
  verantwoordelijke: string;
  aantalMachines: number;
}

export interface getAllSitesResponse extends ListResponse<SiteOverview> {
  items: SiteOverview[]; 
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
export interface getSiteByIdResponse extends SiteOverview {}