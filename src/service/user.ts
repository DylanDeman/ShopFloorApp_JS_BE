import jwt from 'jsonwebtoken';
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT, verifyJWT } from '../core/jwt';
import { getLogger } from '../core/logging';
import type { User, UserCreateInput, UserUpdateInput, PublicUser } from '../types/user';
import type { SessionInfo } from '../types/auth';
import handleDBError from './_handleDBError';
import { Status } from '@prisma/client';

const makeExposedUser = (
  { 
    id, lastname, firstname, email, 
    address_id, phonenumber, birthdate, status, role }
  : User): PublicUser => ({
  id,
  lastname,
  firstname,
  email,
  address_id,
  phonenumber,
  birthdate,
  status,
  role,
});

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (requiredRoles: string[], rolesUser: string[]): void => {
  // Check if any of the required roles are present in the user's roles
  const hasPermission = requiredRoles.some((role) => rolesUser.includes(role));

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { email } });

  if (!gebruiker) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  const passwordValid = await verifyPassword(password, gebruiker.password);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  return await generateJWT(gebruiker);
};

export const register = async ({
  firstname,
  lastname,
  email,
  address_id,
  password,
  birthdate,
  phonenumber,
  role,
}: UserCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.gebruiker.create({
      data: {
        status: Status.ACTIEF,
        lastname,
        firstname,
        email,
        address_id,
        password: passwordHash,
        birthdate,
        phonenumber,
        role: role,
      },
    });

    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getAll = async (): Promise<PublicUser[]> => {
  const users = await prisma.gebruiker.findMany();
  return users.map(makeExposedUser);
};

export const getById = async (id: number): Promise<PublicUser> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { id } });

  if (!gebruiker) {
    throw ServiceError.notFound('No user with this id exists');
  }

  return makeExposedUser(gebruiker);
};

export const updateById = async (id: number, changes: UserUpdateInput): Promise<PublicUser> => {
  try {
    const user = await prisma.gebruiker.update({
      where: { id },
      data: changes,
    });
    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.gebruiker.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};