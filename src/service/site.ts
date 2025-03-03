import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { CreateSiteRequest, CreateSiteResponse, SiteOverview, UpdateSiteRequest, UpdateSiteResponse } from '../types/site';

export const getAllSites = async (): Promise<SiteOverview[]> => {
  try {
    const sites = await prisma.site.findMany({

      where: {
        status: 'ACTIEF'
      },
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
      status: site.status,
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
  };
};

export const createSite = async (data: CreateSiteRequest): Promise<CreateSiteResponse> => {
  try {
    const verantwoordelijke = await prisma.gebruiker.findUnique({
      where: { id: data.verantwoordelijke_id },
      select: { rol: true }, 
    });

    if (!verantwoordelijke) {
      throw new Error('Verantwoordelijke not found.');
    }

    if (verantwoordelijke.rol !== 'VERANTWOORDELIJKE') {
      throw new Error('The user is not a verantwoordelijke.');
    }

    const site = await prisma.site.create({
      data: {
        naam: data.naam,
        verantwoordelijke_id: data.verantwoordelijke_id,
        status: 'ACTIEF',
      },
      include: {
        verantwoordelijke: true,
        Machine: true,
      },
    });

    return {
      id: site.id,
      naam: site.naam,
      status: site.status,
      verantwoordelijke: `${site.verantwoordelijke.voornaam} ${site.verantwoordelijke.naam}`,
      aantalMachines: site.Machine.length,
    };

  } catch (error) {
    throw handleDBError(error); 
  }
};



export const updateSiteById = async (id: number, changes: UpdateSiteRequest): Promise<UpdateSiteResponse> => {
try {
  const site = await prisma.site.update({
    where: {
      id,
    },
    data: changes,
    include: {
      Machine: true,
      verantwoordelijke: true,
    },
  });
  const aantalMachines = site.Machine.length;

  const response: UpdateSiteResponse = {
    id: site.id,
    naam: site.naam,
    verantwoordelijke: site.verantwoordelijke.naam,
    aantalMachines,
  };
  return response
} catch (error) {
  throw handleDBError(error);
};
};

export const deleteSiteById = async (id: number): Promise<void> => {
  try {
    const site = await prisma.site.update({
      where: {id},
      data: {
        status: 'INACTIEF'
      },
    });

    if (!site){
      throw new Error("Site niet gevonden!");
    }
  } catch (error) {
    handleDBError(error);
    throw new Error('An error occurred while deleting the user, please try again.');
  }
};



