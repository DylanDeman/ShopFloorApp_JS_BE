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