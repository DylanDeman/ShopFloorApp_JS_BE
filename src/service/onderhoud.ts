import { prisma } from '../data';
import type { Onderhoud } from '../types/onderhoud';

export const getAll = async (): Promise<Onderhoud[]> => {
  const onderhouds = await prisma.onderhoud.findMany();
  return onderhouds.map((o) => ({
    ...o,
    opmerking: o.opmerkingen,
    id: o.onderhoud_id,
  }));
};
