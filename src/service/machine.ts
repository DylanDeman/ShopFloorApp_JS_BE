import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { Machine } from '../types/machine';

// Wat je wilt dat je krijgt als je een machine
const SELECT_MACHINE = {
  id: true,
  product_id: true,
  code: true,
  locatie: true,
  status: true,
  product_informatie: true,
  productie_status: true,
  technieker: {
    select: {
      id: true,
      voornaam: true,
      naam: true,
    },
  },
  site : {
    select : {
      id: true,
      naam: true,
      verantwoordelijke: true,
    },
  },
};

export const getAllMachines = async (): Promise<Machine[]> => {
  try {
    const machines = await prisma.machine.findMany({
      select: SELECT_MACHINE,
    });

    if (!machines.length) {
      throw ServiceError.notFound('Geen machines gevonden.');
    }

    return machines;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getMachineById = async (id: number) => {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id },
      select: SELECT_MACHINE,
    });

    if (!machine) {
      throw ServiceError.notFound('Machine niet gevonden');
    }

    return machine;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateMachineById = async (id: number, 
  {site_id, product_id, technieker_gebruiker_id, code, locatie, status, productie_status}: any) => {
  try{
    const previousMachine = await prisma.machine.findUnique({
      where: { id },
      select: {
        status: true,
      },
    });

    if(!previousMachine){
      throw ServiceError.notFound('Machine niet gevonden');
    }
    
    const machine = await prisma.machine.update(
      {
        where: { id }, 
        data: {site_id, product_id, technieker_gebruiker_id, code, locatie, status, productie_status},
      },
    );
    
    if (previousMachine.status !== status){
      await prisma.notificatie.create({
        data: {
          bericht: `Machine ${machine.id} ${machine.status}`,
        },
      });
    }

    return machine;
  } catch (error) {
    throw handleDBError(error);
  }
};