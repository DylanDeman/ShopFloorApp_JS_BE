import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { SiteOverview } from '../types/site';

export const getAllSites = async (): Promise<SiteOverview[]> => {
  try {
    const sites = await prisma.site.findMany({
      include: {
        verantwoordelijke: true,
        Machine: true,
      },
    });

    if (!sites.length) {
      throw ServiceError.notFound('Geen sites gevonden.');
    }

    return sites.map((site) => ({
      id: site.id,
      naam: site.naam,
      verantwoordelijke: `${site.verantwoordelijke.voornaam} ${site.verantwoordelijke.naam}`,
      aantalMachines: site.Machine.length,
    }));
  } catch (error) {

    if (error instanceof ServiceError){
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getSiteById = async (id: number) => {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        verantwoordelijke: true,
        Machine: true,
      },
    });

    if (!site) {
      throw ServiceError.notFound('Site niet gevonden');
    }

    return {
      id: site.id,
      naam: site.naam,
      verantwoordelijke: `${site.verantwoordelijke.voornaam} ${site.verantwoordelijke.naam}`,
      aantalMachines: site.Machine.length,
      machines: site.Machine.map((machine) => ({
        id: machine.id,
        locatie: machine.locatie,
        status: machine.status,
        productieStatus: machine.productie_status,
      })),
    };
  } catch (error) {
    throw handleDBError(error);
  }
};