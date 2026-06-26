import { authHeaders } from './helpers';
import type { Cripto } from '../types';

export const criptosApi = {
  getAll(params?: Record<string, string | number | undefined>) {
    const search = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)])
    ).toString() : '';
    return fetch(`/api/criptos${search}`, { headers: { ...authHeaders() } }).then(r => r.json()) as Promise<Cripto[]>;
  },
  getById(id: number) {
    return fetch(`/api/criptos/${id}`, { headers: { ...authHeaders() } }).then(r => r.json()) as Promise<Cripto>;
  },
};
