import { prisma } from '../data';
import type { Onderhoud, OnderhoudCreateInput } from '../types/onderhoud';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';

const ONDERHOUD_SELECT = {
  id: true,
  machine_id: true,
  technieker: {
    select: {
      id: true,
      voornaam: true,
      naam: true,
    },
  },
  datum: true,
  starttijdstip: true,
  eindtijdstip: true,
  reden: true,
  status: true,
  opmerkingen: true,
};

export const getAllOnderhouden = async (): Promise<Onderhoud[]> => {
  try {
    const onderhouden = await prisma.onderhoud.findMany({
      select: ONDERHOUD_SELECT,
    });
    if (!onderhouden.length) {
      throw ServiceError.notFound('Geen machines gevonden.');
    }
    return onderhouden;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getOnderhoudById = async (id: number) => {
  try{
    const onderhoud = await prisma.onderhoud.findUnique({
      where: { id },
      select: ONDERHOUD_SELECT,
    });
  
    if(!onderhoud){
      throw ServiceError.notFound('Onderhoud niet gevonden!');
    }
  
    return onderhoud;
  } catch(error){
    if(error instanceof ServiceError){
      throw error;
    }
    throw handleDBError(error);
  }
};

export const updateOnderhoudById = async (
  id: number,
  {
    machine_id,
    datum,
    starttijdstip,
    eindtijdstip,
    reden,
    status,
    opmerkingen,
    technieker_id,
  }: any,
) => {
  try {
    const technieker = await prisma.gebruiker.findUnique({
      where: { id: technieker_id },
    });

    if (!technieker) {
      throw ServiceError.notFound(`Technieker with id ${technieker_id} not found`);
    }

    const onderhoud = await prisma.onderhoud.update({
      where: { id },
      data: {
        machine_id,
        technieker_id,
        datum,
        starttijdstip,
        eindtijdstip,
        reden,
        status,
        opmerkingen,
      },
      include: {
        technieker: true,
      },
    });

    return onderhoud;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const createOnderhoud = async (data: OnderhoudCreateInput): Promise<Onderhoud> => {
  try {
    const onderhoud = await prisma.onderhoud.create({
      data,
      select: ONDERHOUD_SELECT,
    });

    return onderhoud;
  } catch (error) {
    throw handleDBError(error); 
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.onderhoud.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};