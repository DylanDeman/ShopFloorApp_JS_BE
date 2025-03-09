import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import type { KPI } from '../types/kpi';

const KPI_SELECT = {
  id: true,
  onderwerp: true,
  roles: true,
  grafiek: true,
};

export const getAll = async (): Promise<KPI[]> => {
  return prisma.kPI.findMany();
};

export const getById = async (id: number): Promise<KPI> => {
  const kpi = await prisma.kPI.findUnique({
    where: {
      id,
    },
    select: KPI_SELECT,
  });

  if (!kpi) {
    throw ServiceError.notFound('No kpi with this id exists');
  }

  return kpi;
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.kPI.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getKPIByRole = async (role: string): Promise<KPI[]> => {
  const kpis = await prisma.kPI.findMany({
    where: {
      OR: [
        { roles: { equals: role } },
        { roles: { array_contains: role } },
      ],
    },
  });

  return kpis;
};

export const getKPIidPerStatus = (status: string): number => {
  const kpiMap: Record<string, number> = {
    'DRAAIT': 12,
    'MANUEEL_GESTOPT': 13,
    'AUTOMATISCH_GESTOPT': 14,
    'IN_ONDERHOUD': 15,
    'STARTBAAR': 16,
  };
  return kpiMap[status] || 0;
};