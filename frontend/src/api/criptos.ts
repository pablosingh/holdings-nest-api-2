import { createApi } from './client';
import type { Cripto } from '../types';

export const criptosApi = {
  getAll(params?: Record<string, string | number | undefined>) {
    return fetch(`/api/criptos${params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)])
    ).toString() : ''}`).then(r => r.json()) as Promise<Cripto[]>;
  },
  getById(id: number) {
    return fetch(`/api/criptos/${id}`).then(r => r.json()) as Promise<Cripto>;
  },
};
