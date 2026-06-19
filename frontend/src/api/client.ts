async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

function buildUrl(base: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return base;
  const search = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) search.set(key, String(val));
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export function createApi<T, CreateDto, UpdateDto>(resource: string) {
  const BASE = `/api/${resource}`;

  return {
    getAll(params?: Record<string, string | number | undefined>): Promise<T[]> {
      return fetch(buildUrl(BASE, params)).then(handleResponse<T[]>);
    },
    getById(id: number): Promise<T> {
      return fetch(`${BASE}/${id}`).then(handleResponse<T>);
    },
    create(data: CreateDto): Promise<T> {
      return fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<T>);
    },
    update(id: number, data: UpdateDto): Promise<T> {
      return fetch(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse<T>);
    },
    delete(id: number): Promise<{ deleted: boolean }> {
      return fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handleResponse<{ deleted: boolean }>);
    },
  };
}
