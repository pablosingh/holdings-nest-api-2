import { createApi } from './client';
import type { Holding, CreateHoldingDto, UpdateHoldingDto } from '../types';

export const holdingsApi = createApi<Holding, CreateHoldingDto, UpdateHoldingDto>('holdings');
