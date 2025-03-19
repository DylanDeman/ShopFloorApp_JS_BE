import { prisma } from '../data';
import handleDBError from './_handleDBError';
import type { Product } from '../types/product';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await prisma.product.findMany({
      select: {
        id: true,  
        naam: true,
      },
    });
  } catch (error) {
    handleDBError(error);  
    return []; 
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    return await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,  // Select the necessary fields
        naam: true,
      },
    });
  } catch (error) {
    handleDBError(error);  // Handle error properly
    return null;  // Return null in case of error (can be customized as needed)
  }
};
