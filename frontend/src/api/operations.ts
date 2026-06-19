import { createApi } from './client';
import type { Operation, CreateOperationDto, UpdateOperationDto } from '../types';

export const operationsApi = createApi<Operation, CreateOperationDto, UpdateOperationDto>('operations');
