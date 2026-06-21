import { useState, useEffect, useCallback } from 'react';
import { holdingsApi } from '../../api/holdings';
import { HoldingList } from './HoldingList';
import type { Holding } from '../../types';

export function HoldingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try { setHoldings(await holdingsApi.getAll()); setError(null); }
    catch { setError('Error al conectar con el servidor'); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Holdings</h1>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <HoldingList holdings={holdings} />
      </div>
    </div>
  );
}
