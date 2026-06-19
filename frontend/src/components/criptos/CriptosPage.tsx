import { useState, useEffect, useCallback } from 'react';
import { criptosApi } from '../../api/criptos';
import { CriptoList } from './CriptoList';
import { CriptoForm } from './CriptoForm';
import type { Cripto, CreateCriptoDto } from '../../types';

export function CriptosPage() {
  const [criptos, setCriptos] = useState<Cripto[]>([]);
  const [editingCripto, setEditingCripto] = useState<Cripto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try { setCriptos(await criptosApi.getAll()); setError(null); }
    catch { setError('Error al conectar con el servidor'); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSubmit = async (data: CreateCriptoDto) => {
    try {
      if (editingCripto) { await criptosApi.update(editingCripto.id, data); setEditingCripto(null); }
      else { await criptosApi.create(data); }
      await fetch();
    } catch { setError('Error al guardar cripto'); }
  };

  const handleDelete = async (id: number) => {
    try { await criptosApi.delete(id); await fetch(); }
    catch { setError('Error al eliminar cripto'); }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Criptos</h1>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <CriptoForm editingCripto={editingCripto} onSubmit={handleSubmit} onCancel={() => setEditingCripto(null)} />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <CriptoList criptos={criptos} onEdit={setEditingCripto} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
