import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { Notificatie, NotificatieCreateInput } from '../types/notificatie';

const NOTIFICATIE_SELECT = {
  id: true,
  bericht: true,
  tijdstip: true,
  gelezen: true,
};

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

export const updateNotificatieById = async (id: number, 
  {tijdstip, bericht, gelezen}: any) => {
  try{

    const notificatie = await prisma.notificatie.update({
      where: { id },
      data: {
        tijdstip: tijdstip,
        bericht: bericht,
        gelezen: gelezen,
      },
    });

    return notificatie;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const createNotificatie = async (data: NotificatieCreateInput): Promise<Notificatie> => {
  try {

    const notificatie = await prisma.notificatie.create({
      data: {
        bericht: data.bericht,
        tijdstip: data.tijdstip,
        gelezen: data.gelezen,
      },
      select: NOTIFICATIE_SELECT,
    });

    return notificatie;
  } catch (error) {
    throw handleDBError(error); 
  }
};