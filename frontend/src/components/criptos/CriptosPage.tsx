import { useState, useEffect, useCallback } from 'react';
import { criptosApi } from '../../api/criptos';
import { CriptoList } from './CriptoList';
import type { Cripto } from '../../types';

export function CriptosPage() {
  const [criptos, setCriptos] = useState<Cripto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try { setCriptos(await criptosApi.getAll()); setError(null); }
    catch { setError('Error al conectar con el servidor'); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Criptos</h1>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <CriptoList criptos={criptos} />
      </div>
    </div>
  );
}
