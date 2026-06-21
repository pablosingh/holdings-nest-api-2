import { createApi } from './client';
import type { User, CreateUserDto } from '../types';

const full = createApi<User, CreateUserDto, any>('users');

export const usersApi = {
  getAll: full.getAll,
  getById: full.getById,
  create: full.create,
};
