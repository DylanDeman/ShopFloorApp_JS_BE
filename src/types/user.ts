import type { Prisma, Status } from '@prisma/client';
import type { Entity, ListResponse } from './common';
export interface User extends Entity {
  firstname: string,
  lastname: string;
  address_id: number,
  email: string;
  password: string;
  birthdate: Date,
  phonenumber: string,
  role: Prisma.JsonValue;
  status: Status
}

export interface UserCreateInput {
  firstname: string,
  lastname: string;
  email: string;
  address_id: number;
  password: string;
  birthdate: Date;
  phonenumber: string,
  role: any,
}

export interface PublicUser extends Omit<User, 'password'> {}

export interface UserUpdateInput extends Pick<UserCreateInput, 'firstname' | 'email'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetUserRequest {
  id: number | 'me';
}
export interface RegisterUserRequest {
  address_id: number;
  lastname: string;
  firstname: string;
  birthdate: Date;
  email: string;
  password: string;
  phonenumber: string;
  role: any;
  status: Status
}
export interface UpdateUserRequest extends Omit<RegisterUserRequest, 'password' | 'role'> {}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface UpdateUserResponse extends GetUserByIdResponse {}

export interface LoginResponse {
  token: string;
}