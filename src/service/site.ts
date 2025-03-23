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
import { Machine_Status, Status } from '@prisma/client'; 

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
    const sites = await prisma.site.findMany({
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
    const prevStatusSite = await prisma.site.findUnique({
      where: { id },
      select: { status: true },
    });

    // Als de site niet bestaat, gooi een error
    if(!prevStatusSite) {
      throw new Error('Site not found.');
    }

    // Check of de status van de site is veranderd
    if (changes.status && changes.status !== prevStatusSite.status) {
      // Als de status is veranderd naar INACTIEF, moeten ook alle machines op INACTIEF worden gezet
      if (changes.status === 'INACTIEF') {
        await prisma.machine.updateMany({
          where: { site_id: id },
          data: { status: Machine_Status.AUTOMATISCH_GESTOPT },
        });
      }
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

