import type { Entity, ListResponse } from './common';

export interface Notificatie extends Entity {
  message: string;
  time: Date;
  isread: boolean;
}

export interface GetAllNotificatiesResponse extends ListResponse<Notificatie> {
  items: Notificatie[];
  total: number;
}

export interface NotificatieCreateInput {
  message: string;
  time: Date;
  isread: boolean;
}

export interface GetNotificatieByIdResponse extends Notificatie {};

export interface CreateNotificatieRequest extends NotificatieCreateInput {};
export interface CreateNotificatieResponse extends GetNotificatieByIdResponse{};