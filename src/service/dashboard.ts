import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { DashboardOverview } from '../types/dashboard';

export const getAllDashboards = async (): Promise<DashboardOverview[]> => {
  try {
    const dashboards = await prisma.dashboard.findMany({
      include: {
        gebruiker: true,
        kpi: true,
      },
    });

    if (!dashboards.length) {
      throw ServiceError.notFound('Geen dashboards gevonden.');
    }

    return dashboards.map((dashboard) => ({
      id: dashboard.id,
      gebruiker_id: dashboard.gebruiker.id,
      kpi_id: dashboard.kpi.id,
    }));
  } catch (error) {

    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getDashboardById = async (id: number) => {
  try {
    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
      include: {
        gebruiker: true,
        kpi: true,
      },
    });

    if (!dashboard) {
      throw ServiceError.notFound('Dashboard niet gevonden');
    }

    return {
      id: dashboard.id,
      gebruiker_id: dashboard.gebruiker.id,
      kpi_id: dashboard.kpi.id,
    };
  } catch (error) {
    throw handleDBError(error);
  }
};