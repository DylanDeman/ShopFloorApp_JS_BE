import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import roles from '../core/roles'; 
import type { 
  SiteCreateInput,
  Site,
  SiteUpdateInput, 
  UpdateSiteResponse, 
} from '../types/site';
import { Status } from '@prisma/client'; 

// Wat je wilt dat je krijgt als je een site opvraagt:
const SITE_SELECT = {
  id: true,
  naam: true,
  status: true,
  verantwoordelijke: {
    select: {
      id: true,
      voornaam: true,
      naam: true,
    },
  },
  machines: {
    select: {
      id: true,
      locatie: true,
      status: true,
      productie_status : true,
      technieker : {
        select: {
          id: true,
          voornaam: true,
          naam: true,
        },
      },
    },
  },
};

export const getAllSites = async(): Promise<Site[]> => {
  try {
    // We gaan enkel actieve sites ophalen
    const filters = { status: Status.ACTIEF }; 
    const sites = await prisma.site.findMany({
      where: filters,
      select: SITE_SELECT,
    });

    if (!sites.length) {
      throw ServiceError.notFound('Geen sites gevonden.');
    }

    return sites;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getSiteById = async (id: number): Promise<Site> => {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
      select: SITE_SELECT,
    });

    if (!site) {
      throw ServiceError.notFound('Site niet gevonden.');
    }

    return site;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const createSite = async (data: SiteCreateInput): Promise<Site> => {
  try {
    // Vind gebruiker met verantwoordelijke_id
    const verantwoordelijke = await prisma.gebruiker.findUnique({
      where: { id: data.verantwoordelijke_id },
      select: { rol: true }, 
    });

    // Als de gebruiker niet bestaat, gooi een error
    if (!verantwoordelijke) {
      throw new Error('Verantwoordelijke not found.');
    }

    // Als de gebruiker geen verantwoordelijke is, gooi een error
    const rol = verantwoordelijke.rol as string;
    if (!rol.includes(roles.VERANTWOORDELIJKE)) {
      throw new Error('The user is not a verantwoordelijke.');
    }

    // Check of Status een geldige waarde is
    if (!Object.values(Status).includes(data.status as Status)) {
      throw new Error('Invalid status');
    }

    const site = await prisma.site.create({
      data: {
        naam: data.naam,
        verantwoordelijke_id: data.verantwoordelijke_id,
        status: data.status as Status,
        machines: {
          connect: data.machines_ids.map((machineId) => ({ id: machineId })),
        },
      },
      select: SITE_SELECT,
    });

    return site;
  } catch (error) {
    throw handleDBError(error); 
  }
};

export const updateSiteById = async (id: number, changes: SiteUpdateInput): Promise<UpdateSiteResponse> => {
  try {
    // Check of Status een geldige waarde is
    if (!Object.values(Status).includes(changes.status as Status)) {
      throw new Error('Invalid status');
    }

    // Site updaten:
    const site = await prisma.site.update({
      where: {
        id,
      },
      data: {
        naam: changes.naam,
        verantwoordelijke_id: changes.verantwoordelijke_id,
        status: changes.status as Status, 
        machines: {
          set: changes.machines_ids.map((machineId) => ({ id: machineId })),
        },
      },
      select: SITE_SELECT,
    });
    
    return site;
  } catch(error) {
    throw handleDBError(error);
  }
};

export const deleteSiteById = async (id: number): Promise<void> => {
  try {
    const site = await prisma.site.update({
      where: {id},
      data: {
        status: 'INACTIEF',
      },
    });

    if (!site){
      throw new Error('Site niet gevonden!');
    }
  } catch (error) {
    handleDBError(error);
    throw new Error('An error occurred while deleting the user, please try again.');
  }
};

