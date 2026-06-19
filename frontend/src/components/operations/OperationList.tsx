import type { Operation } from '../../types';

interface Props {
  operations: Operation[];
  onEdit: (o: Operation) => void;
  onDelete: (id: number) => void;
}

export function OperationList({ operations, onEdit, onDelete }: Props) {
  if (!operations.length) {
    return <p className="py-8 text-center text-gray-500">No hay operaciones.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ticker</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Tipo</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Cantidad</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Precio</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Exchange</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {operations.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{o.id}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{new Date(o.date).toLocaleDateString()}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{o.ticker}</td>
              <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.buy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {o.buy ? 'BUY' : 'SELL'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">{parseFloat(o.number).toFixed(6)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">${parseFloat(o.price).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">${parseFloat(o.total).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{o.exchange || '-'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                <button onClick={() => onEdit(o)} className="mr-2 rounded bg-indigo-100 px-3 py-1 text-indigo-700 hover:bg-indigo-200">Editar</button>
                <button onClick={() => onDelete(o.id)} className="rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
