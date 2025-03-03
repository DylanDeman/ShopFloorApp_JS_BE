import type { Entity, ListResponse } from './common';

export interface Notificatie extends Entity {
  bericht: string;
  tijdstip: Date;
  gelezen: boolean;
}

export interface getAllNotificatiesResponse extends ListResponse<Notificatie> {
  items: Notificatie[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface getNotificatieByIdResponse extends Notificatie {};