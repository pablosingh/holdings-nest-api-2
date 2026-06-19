import { createApi } from './client';
import type { Cripto, CreateCriptoDto, UpdateCriptoDto } from '../types';

export const criptosApi = createApi<Cripto, CreateCriptoDto, UpdateCriptoDto>('criptos');
