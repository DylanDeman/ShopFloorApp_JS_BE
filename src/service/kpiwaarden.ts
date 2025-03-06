import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import type { KPIWaarde } from '../types/kpiwaarden';

const KPIWAARDE_SELECT = {
  id: true,
  datum: true,
  waarde: true,
};

export const getAll = async (): Promise<KPIWaarde[]> => {
  return prisma.kPIWaarde.findMany();
};

export const getById = async (id: number): Promise<KPIWaarde> => {
  const kpiwaarde = await prisma.kPIWaarde.findUnique({
    where: {
      id,
    },
    select: KPIWAARDE_SELECT,
  });

  if (!kpiwaarde) {
    throw ServiceError.notFound('No kpiwaarde with this id exists');
  }

  return kpiwaarde;
};

export const getKPIWaardenByKPIid = async (kpi_id: number): Promise<KPIWaarde[]> => {
  return await prisma.kPIWaarde.findMany({
    where: {
      kpi_id,
    },
    select: KPIWAARDE_SELECT,
  });
};