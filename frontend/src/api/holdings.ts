import { authHeaders } from './helpers';
import type { Holding } from '../types';

export const holdingsApi = {
  getAll(params?: Record<string, string | number | undefined>) {
    const search = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)])
    ).toString() : '';
    return fetch(`/api/holdings${search}`, { headers: { ...authHeaders() } }).then(r => r.json()) as Promise<Holding[]>;
  },
  getById(id: number) {
    return fetch(`/api/holdings/${id}`, { headers: { ...authHeaders() } }).then(r => r.json()) as Promise<Holding>;
  },
};
