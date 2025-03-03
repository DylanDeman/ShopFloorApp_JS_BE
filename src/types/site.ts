import { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface SiteOverview extends Entity{
  naam: string;
  verantwoordelijke: string;
  aantalMachines: number;
}

export interface getAllSitesResponse extends ListResponse<SiteOverview>{}
export interface getSiteByIdResponse extends SiteOverview {}

export interface UpdateSiteRequest extends Omit<Prisma.SiteUpdateInput, 'aantalMachines'> {}

export interface UpdateSiteResponse extends getSiteByIdResponse{}

export interface CreateSiteRequest{
  naam: string;
  verantwoordelijke_id: number;

}

export interface CreateSiteResponse {
  id: number;
  naam: string;
  verantwoordelijke: string;
  status: string;
  aantalMachines: number
}
