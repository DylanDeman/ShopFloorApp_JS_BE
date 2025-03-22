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
  return prisma.kPI.findMany({
    select: KPI_SELECT,
  });
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

export const getKPIid = (kpi: string): number => {
  const kpiMap: Record<string, number> = {
    'ALGEMENE_GEZONDHEID': 1,
    'SITE_GEZONDHEID': 2,
    'PRODUCTIEGRAADHOOGLAAG': 3,
    'PRODUCTIEGRAADLAAGHOOG': 4,
    'GEZOND': 5,
    'FALEND': 6,
    'NOOD_ONDERHOUD': 7,
    'AANKOMEND_ONDERHOUD': 8,
    'LAATSTEONDERHOUDEN': 9,
    'DRAAIT': 10,
    'MANUEEL_GESTOPT': 11,
    'AUTOMATISCH_GESTOPT': 12,
    'IN_ONDERHOUD': 13,
    'STARTBAAR': 14,
  };
  return kpiMap[kpi] || 0;
};