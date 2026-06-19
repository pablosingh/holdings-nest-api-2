import { useState, useEffect } from 'react';
import type { Cripto, CreateCriptoDto } from '../../types';

interface Props {
  editingCripto: Cripto | null;
  onSubmit: (data: CreateCriptoDto) => void;
  onCancel: () => void;
}

export function CriptoForm({ editingCripto, onSubmit, onCancel }: Props) {
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    setTicker(editingCripto?.ticker ?? '');
    setPrice(editingCripto?.price ?? '');
  }, [editingCripto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !price) return;
    onSubmit({ ticker: ticker.trim(), price: parseFloat(price) });
    setTicker(''); setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{editingCripto ? 'Editar Cripto' : 'Nuevo Cripto'}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ticker</label>
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio</label>
        <input type="number" step="any" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{editingCripto ? 'Actualizar' : 'Crear'}</button>
        {editingCripto && <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Cancelar</button>}
      </div>
    </form>
  );
}
