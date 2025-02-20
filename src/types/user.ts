import type { Prisma, Status } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface User extends Entity {
  voornaam: string,
  naam: string;
  adres_id: number,
  email: string;
  wachtwoord: string;
  geboortedatum: Date,
  gsm: string,
  rol: Prisma.JsonValue;
  status: Status
}

export interface UserCreateInput {
  voornaam: string,
  naam: string;
  email: string;
  adres_id: number;
  wachtwoord: string;
  geboortedatum: Date;
  gsm: string,
  rol: any,
}

export interface PublicUser extends Omit<User, 'wachtwoord'> {}

export interface UserUpdateInput extends Pick<UserCreateInput, 'voornaam' | 'email'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetUserRequest {
  id: number | 'me';
}
export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}
export interface UpdateUserRequest extends Pick<RegisterUserRequest, 'name' | 'email'> {}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface UpdateUserResponse extends GetUserByIdResponse {}

export interface LoginResponse {
  token: string;
}