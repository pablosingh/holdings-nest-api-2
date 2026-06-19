import { useState, useEffect, useCallback } from 'react';
import { holdingsApi } from '../../api/holdings';
import { HoldingList } from './HoldingList';
import { HoldingForm } from './HoldingForm';
import type { Holding, CreateHoldingDto } from '../../types';

export function HoldingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try { setHoldings(await holdingsApi.getAll()); setError(null); }
    catch { setError('Error al conectar con el servidor'); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSubmit = async (data: CreateHoldingDto) => {
    try {
      if (editingHolding) { await holdingsApi.update(editingHolding.id, data); setEditingHolding(null); }
      else { await holdingsApi.create(data); }
      await fetch();
    } catch { setError('Error al guardar holding'); }
  };

  const handleDelete = async (id: number) => {
    try { await holdingsApi.delete(id); await fetch(); }
    catch { setError('Error al eliminar holding'); }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Holdings</h1>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <HoldingForm editingHolding={editingHolding} onSubmit={handleSubmit} onCancel={() => setEditingHolding(null)} />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <HoldingList holdings={holdings} onEdit={setEditingHolding} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
