import { prisma } from '../data';
import type { Onderhoud } from '../types/onderhoud';

export const getAll = async (): Promise<Onderhoud[]> => {
  return prisma.onderhoud.findMany();
};
