import type { Entity, ListResponse } from './common';
import type { Machine } from './machine';
import type { User } from './user';

// Types voor de REST laag
export interface Site extends Entity {
  naam: string;
  status: string;
  verantwoordelijke: Pick<User, 'id' | 'voornaam' | 'naam'>;
  machines: Pick<Machine, 'id' | 'locatie' | 'status' | 'productie_status' | 'technieker'>[];
}

export interface SiteCreateInput {
  naam: string;
  status: string;
  verantwoordelijke_id: number;
}

export interface SiteUpdateInput extends SiteCreateInput {}

// Types voor de service laag
export interface CreateSiteRequest extends SiteCreateInput {};
export interface UpdateSiteRequest extends SiteUpdateInput {};

export interface GetAllSitesResponse extends ListResponse<Site> {};
export interface GetSiteByIdResponse extends Site {};
export interface CreateSiteResponse extends GetSiteByIdResponse{};
export interface UpdateSiteResponse extends GetSiteByIdResponse{};
