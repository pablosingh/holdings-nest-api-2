import { useState, useEffect, useCallback } from 'react';
import { operationsApi } from '../../api/operations';
import { OperationList } from './OperationList';
import { OperationForm } from './OperationForm';
import type { Operation, CreateOperationDto } from '../../types';

export function OperationsPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try { setOperations(await operationsApi.getAll()); setError(null); }
    catch { setError('Error al conectar con el servidor'); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSubmit = async (data: CreateOperationDto) => {
    try {
      if (editingOperation) { await operationsApi.update(editingOperation.id, data); setEditingOperation(null); }
      else { await operationsApi.create(data); }
      await fetch();
    } catch { setError('Error al guardar operación'); }
  };

  const handleDelete = async (id: number) => {
    try { await operationsApi.delete(id); await fetch(); }
    catch { setError('Error al eliminar operación'); }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Operaciones</h1>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <OperationForm editingOperation={editingOperation} onSubmit={handleSubmit} onCancel={() => setEditingOperation(null)} />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <OperationList operations={operations} onEdit={setEditingOperation} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
