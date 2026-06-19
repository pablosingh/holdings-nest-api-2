import { useState, useEffect } from 'react';
import type { Holding, CreateHoldingDto, User, Cripto } from '../../types';
import { usersApi } from '../../api/users';
import { criptosApi } from '../../api/criptos';

interface Props {
  editingHolding: Holding | null;
  onSubmit: (data: CreateHoldingDto) => void;
  onCancel: () => void;
}

export function HoldingForm({ editingHolding, onSubmit, onCancel }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [criptos, setCriptos] = useState<Cripto[]>([]);
  const [ticker, setTicker] = useState('');
  const [amount, setAmount] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [initialTotal, setInitialTotal] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(() => {});
    criptosApi.getAll().then(setCriptos).catch(() => {});
  }, []);

  useEffect(() => {
    if (editingHolding) {
      setTicker(editingHolding.ticker);
      setAmount(editingHolding.amount);
      setInitialPrice(editingHolding.initial_price);
      setInitialTotal(editingHolding.initial_total);
      setUserId(String(editingHolding.user_id));
    }
  }, [editingHolding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !amount || !initialPrice || !initialTotal || !userId) return;
    onSubmit({
      ticker: ticker.trim(),
      amount: parseFloat(amount),
      initial_price: parseFloat(initialPrice),
      initial_total: parseFloat(initialTotal),
      user_id: parseInt(userId),
    });
    setTicker(''); setAmount(''); setInitialPrice(''); setInitialTotal(''); setUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{editingHolding ? 'Editar Holding' : 'Nuevo Holding'}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ticker</label>
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} list="tickers" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
        <datalist id="tickers">{criptos.map((c) => <option key={c.id} value={c.ticker} />)}</datalist>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
        <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio Inicial</label>
        <input type="number" step="any" value={initialPrice} onChange={(e) => setInitialPrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Inicial</label>
        <input type="number" step="any" value={initialTotal} onChange={(e) => setInitialTotal(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required>
          <option value="">Seleccionar...</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{editingHolding ? 'Actualizar' : 'Crear'}</button>
        {editingHolding && <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Cancelar</button>}
      </div>
    </form>
  );
}
