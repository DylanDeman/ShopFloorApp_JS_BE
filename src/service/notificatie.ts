import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { Notificatie } from '../types/notificatie';

export const getAllNotificaties = async (page = 0, limit = 0): Promise<{items: Notificatie[], total: number}> => {
  try{
    let notificaties;
    if(page === 0 || limit === 0){
      notificaties = await prisma.notificatie.findMany({});
    } else {
      const skip = (page - 1) * limit;
      notificaties = await prisma.notificatie.findMany({
        skip: skip,
        take: limit,
      });
    }

    const total = await prisma.notificatie.count();

    if(!notificaties.length){
      throw ServiceError.notFound('Geen notificaties gevonden.');
    }

    return {
      items: notificaties.map((notificatie) => 
        ({
          id: notificatie.id,
          bericht: notificatie.bericht,
          tijdstip: notificatie.tijdstip,
          gelezen: notificatie.gelezen,
        }),
      ),
      total,
    };

  } catch (error) {
    if (error instanceof ServiceError){
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getNotificatieById = async (id: number) => {
  try{
    const notificatie = await prisma.notificatie.findUnique({
      where: { id },
    });

    if (!notificatie){
      throw ServiceError.notFound('Notificatie niet gevonden');
    }

    return notificatie;
  } catch (error) {
    if(error instanceof ServiceError){
      throw error;
    }
    throw handleDBError(error);
  }
};