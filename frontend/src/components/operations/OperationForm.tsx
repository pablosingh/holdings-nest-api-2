import { useState, useEffect } from 'react';
import type { Operation, CreateOperationDto, User } from '../../types';
import { usersApi } from '../../api/users';

interface Props {
  editingOperation: Operation | null;
  onSubmit: (data: CreateOperationDto) => void;
  onCancel: () => void;
}

export function OperationForm({ editingOperation, onSubmit, onCancel }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [ticker, setTicker] = useState('');
  const [number, setNumber] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [buy, setBuy] = useState(true);
  const [exchange, setExchange] = useState('');
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(() => {});
  }, []);

  useEffect(() => {
    if (editingOperation) {
      setTicker(editingOperation.ticker);
      setNumber(editingOperation.number);
      setPrice(editingOperation.price);
      setTotal(editingOperation.total);
      setBuy(editingOperation.buy);
      setExchange(editingOperation.exchange ?? '');
      setComment(editingOperation.comment ?? '');
    }
  }, [editingOperation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !number || !price || !total || !userId) return;
    const data: CreateOperationDto = {
      ticker: ticker.trim(),
      number: parseFloat(number),
      price: parseFloat(price),
      total: parseFloat(total),
      buy,
      exchange: exchange.trim() || undefined,
      comment: comment.trim() || undefined,
      user_id: parseInt(userId),
    };
    onSubmit(data);
    setTicker(''); setNumber(''); setPrice(''); setTotal(''); setBuy(true);
    setExchange(''); setComment(''); setUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{editingOperation ? 'Editar Operación' : 'Nueva Operación'}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required>
          <option value="">Seleccionar...</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ticker</label>
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input type="number" step="any" value={number} onChange={(e) => setNumber(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input type="number" step="any" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input type="number" step="any" value={total} onChange={(e) => setTotal(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="radio" checked={buy} onChange={() => setBuy(true)} className="text-indigo-600" />
          Compra
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="radio" checked={!buy} onChange={() => setBuy(false)} className="text-indigo-600" />
          Venta
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Exchange</label>
        <input type="text" value={exchange} onChange={(e) => setExchange(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Comentario</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{editingOperation ? 'Actualizar' : 'Crear'}</button>
        {editingOperation && <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Cancelar</button>}
      </div>
    </form>
  );
}
