import type { Entity, ListResponse } from './common';

export interface DashboardOverview extends Entity {
  gebruiker_id: number;
  kpi_id: number;
}

export interface getAllDashboardsResponse extends ListResponse<DashboardOverview> { }
export interface getDashboardByIdResponse extends DashboardOverview { }