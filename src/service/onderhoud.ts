import { prisma } from '../data';
import type { Onderhoud, OnderhoudCreateInput } from '../types/onderhoud';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';

const ONDERHOUD_SELECT = {
  id: true,
  machine_id: true,
  technieker_gebruiker_id: true,
  datum: true,
  starttijdstip: true,
  eindtijdstip: true,
  reden: true,
  status: true,
  opmerkingen: true,
};

export const getAllOnderhouden = async (): Promise<{items: Onderhoud[]}> => {
  const onderhouden = await prisma.onderhoud.findMany();

  return {
    items: onderhouden.map(
      (onderhoud) => (
        {
          id: onderhoud.id,
          machine_id: onderhoud.machine_id,
          technieker_gebruiker_id: onderhoud.technieker_gebruiker_id,
          datum: onderhoud.datum,
          starttijdstip: onderhoud.starttijdstip,
          eindtijdstip: onderhoud.eindtijdstip,
          reden: onderhoud.reden,
          status: onderhoud.status,
          opmerkingen: onderhoud.opmerkingen,
        }
      ),
    ),
  };
};

export const getOnderhoudById = async (id: number) => {
  try{
    const onderhoud = await prisma.onderhoud.findUnique({
      where: { id: id },
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
      data: {
        machine_id: data.machine_id,
        technieker_gebruiker_id: data.technieker_gebruiker_id,
        datum: data.datum,
        starttijdstip: data.starttijdstip,
        eindtijdstip: data.eindtijdstip,
        reden: data.reden,
        status: data.status,
        opmerkingen: data.opmerkingen,
      },
      select: ONDERHOUD_SELECT,
    });

    return onderhoud;
  } catch (error) {
    throw handleDBError(error); 
  }
};