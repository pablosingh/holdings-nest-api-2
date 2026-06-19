import { createApi } from './client';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

export const usersApi = createApi<User, CreateUserDto, UpdateUserDto>('users');
