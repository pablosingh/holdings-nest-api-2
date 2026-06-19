import { useState, useEffect } from 'react';
import type { Operation, CreateOperationDto, Cripto, Holding } from '../../types';
import { criptosApi } from '../../api/criptos';
import { holdingsApi } from '../../api/holdings';

interface Props {
  editingOperation: Operation | null;
  onSubmit: (data: CreateOperationDto) => void;
  onCancel: () => void;
}

export function OperationForm({ editingOperation, onSubmit, onCancel }: Props) {
  const [criptos, setCriptos] = useState<Cripto[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [ticker, setTicker] = useState('');
  const [number, setNumber] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [buy, setBuy] = useState(true);
  const [exchange, setExchange] = useState('');
  const [comment, setComment] = useState('');
  const [criptoId, setCriptoId] = useState('');
  const [holdingId, setHoldingId] = useState('');

  useEffect(() => {
    criptosApi.getAll().then(setCriptos).catch(() => {});
    holdingsApi.getAll().then(setHoldings).catch(() => {});
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
      setCriptoId(String(editingOperation.cripto_id));
      setHoldingId(editingOperation.holding_id ? String(editingOperation.holding_id) : '');
    }
  }, [editingOperation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !number || !price || !total || !criptoId) return;
    const data: CreateOperationDto = {
      ticker: ticker.trim(),
      number: parseFloat(number),
      price: parseFloat(price),
      total: parseFloat(total),
      buy,
      exchange: exchange.trim() || undefined,
      comment: comment.trim() || undefined,
      cripto_id: parseInt(criptoId),
      holding_id: holdingId ? parseInt(holdingId) : undefined,
    };
    onSubmit(data);
    setTicker(''); setNumber(''); setPrice(''); setTotal(''); setBuy(true);
    setExchange(''); setComment(''); setCriptoId(''); setHoldingId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{editingOperation ? 'Editar Operación' : 'Nueva Operación'}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ticker</label>
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} list="tickers" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
        <datalist id="tickers">{criptos.map((c) => <option key={c.id} value={c.ticker} />)}</datalist>
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
        <label className="block text-sm font-medium text-gray-700">Cripto</label>
        <select value={criptoId} onChange={(e) => setCriptoId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required>
          <option value="">Seleccionar...</option>
          {criptos.map((c) => <option key={c.id} value={c.id}>{c.ticker} - ${parseFloat(c.price).toLocaleString()}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Exchange</label>
        <input type="text" value={exchange} onChange={(e) => setExchange(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Comentario</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Holding (opcional)</label>
        <select value={holdingId} onChange={(e) => setHoldingId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option value="">Sin holding</option>
          {holdings.map((h) => <option key={h.id} value={h.id}>{h.ticker} - {parseFloat(h.amount).toFixed(4)}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{editingOperation ? 'Actualizar' : 'Crear'}</button>
        {editingOperation && <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Cancelar</button>}
      </div>
    </form>
  );
}
