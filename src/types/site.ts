import type { Entity, ListResponse } from './common';
import type { Machine } from './machine';
import type { User } from './user';

// Types voor de REST laag
export interface Site extends Entity {
  sitename: string;
  status: string;
  verantwoordelijke: Pick<User, 'id' | 'firstname' | 'lastname'>;
  machines: Pick<Machine, 'id' | 'location' | 'machinestatus' | 'productionstatus' | 'technieker'>[];
}

export interface SiteCreateInput {
  sitename: string;
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
