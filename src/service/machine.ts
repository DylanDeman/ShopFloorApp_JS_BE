import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { Machine } from '../types/machine';

export const getAllMachines = async (page = 0, limit = 0): Promise<{items: Machine[], total: number}> => {
  try {
    let machines;
    if(page === 0 || limit === 0){
      machines = await prisma.machine.findMany(
        {
          include: {
            Onderhoud: true,
            product: true,
            site: true,
            technieker: true,
          },
        });
    } else {
      const skip = (page - 1) * limit;
      machines = await prisma.machine.findMany({
        skip: skip,
        take: limit,
        include: {
          Onderhoud: true,
          product: true,
          site: true,
          technieker: true,
        },
      });
    }

    const total = await prisma.machine.count();

    if (!machines.length) {
      throw ServiceError.notFound('Geen machines gevonden.');
    }

    return {
      items: machines.map((machine) => ({
        id: machine.id,
        site_id: machine.site.id,
        product_id: machine.product.id,
        technieker_gebruiker_id: machine.technieker.id,
        code: machine.code,
        locatie: machine.locatie,
        status: machine.status,
        productie_status: machine.productie_status,
      })),
      total,
    };
  } catch (error) {

    if (error instanceof ServiceError){
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getMachineById = async (id: number) => {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id },
      include: {
        Onderhoud: true,
        product: true,
        site: true,
        technieker: true,
      },
    });

    if (!machine) {
      throw ServiceError.notFound('Machine niet gevonden');
    }

    return {
      id: machine.id,
      site_id: machine.site.id,
      product_id: machine.product.id,
      technieker_gebruiker_id: machine.technieker.id,
      code: machine.code,
      locatie: machine.locatie,
      status: machine.status,
      productie_status: machine.productie_status,
    };
  } catch (error) {
    throw handleDBError(error);
  }
};