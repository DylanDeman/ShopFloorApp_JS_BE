import type { Entity, ListResponse } from './common';

export interface Adres extends Entity {
  street: string,
  number: string,
  city: string,
  postalcode: string,
  land: string | null,
}

export interface AdresCreateInput {
  street: string,
  number: string,
  city: string,
  postalcode: string,
  land: string | null,
}

export interface AdresUpdateInput extends AdresCreateInput { }

export interface CreateAdresRequest extends AdresCreateInput { }
export interface UpdateAdresRequest extends AdresUpdateInput { }

export interface GetAllAdressesReponse extends ListResponse<Adres> { }
export interface GetAdresByIdResponse extends Adres { }
export interface CreateAdresResponse extends GetAdresByIdResponse { }
export interface UpdateAdresResponse extends GetAdresByIdResponse { }