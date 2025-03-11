import type { Entity, ListResponse } from './common';

export interface Notificatie extends Entity {
  bericht: string;
  tijdstip: Date;
  gelezen: boolean;
}

export interface GetAllNotificatiesResponse extends ListResponse<Notificatie> {
  items: Notificatie[];
  total: number;
}

export interface NotificatieCreateInput {
  bericht: string;
  tijdstip: Date;
  gelezen: boolean;
}

export interface GetNotificatieByIdResponse extends Notificatie {};

export interface CreateNotificatieRequest extends NotificatieCreateInput {};
export interface CreateNotificatieResponse extends GetNotificatieByIdResponse{};