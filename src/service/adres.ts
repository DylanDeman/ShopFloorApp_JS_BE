import { prisma } from '../data';
import type { Adres, AdresCreateInput, AdresUpdateInput } from '../types/adres';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';

const ADRES_SELECT = {
  id: true,
  straat: true,
  huisnummer: true,
  stadsnaam: true,
  postcode: true,
  land: true,
};

export const getAll = async (): Promise<Adres[]> => {
  return prisma.adres.findMany();
};

export const getById = async (id: number): Promise<Adres> => {
  const adres = await prisma.adres.findUnique({
    where: {
      id,
    },
    select: ADRES_SELECT,
  });

  if (!adres) {
    throw ServiceError.notFound('No adres with this id exists');
  }

  return adres;
};

export const create = async ({
  straat,
  huisnummer,
  stadsnaam,
  postcode,
  land,
}: AdresCreateInput): Promise<Adres> => {
  try {
    return await prisma.adres.create({
      data: {
        straat, huisnummer,
        stadsnaam,
        postcode,
        land,
      },
      select: ADRES_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {
  straat,
  huisnummer,
  stadsnaam,
  postcode,
  land,
}: AdresUpdateInput): Promise<AdresUpdateInput> => {
  try {
    return await prisma.adres.update({
      where: {
        id,
      },
      data: {
        straat,
        huisnummer,
        stadsnaam,
        postcode,
        land,
      },
      select: ADRES_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.adres.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};