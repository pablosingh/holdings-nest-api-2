import type { Cripto } from '../../types';

interface Props {
  criptos: Cripto[];
  onEdit: (c: Cripto) => void;
  onDelete: (id: number) => void;
}

export function CriptoList({ criptos, onEdit, onDelete }: Props) {
  if (!criptos.length) {
    return <p className="py-8 text-center text-gray-500">No hay criptos.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ticker</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Precio</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {criptos.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{c.id}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{c.ticker}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">${parseFloat(c.price).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                <button onClick={() => onEdit(c)} className="mr-2 rounded bg-indigo-100 px-3 py-1 text-indigo-700 hover:bg-indigo-200">Editar</button>
                <button onClick={() => onDelete(c.id)} className="rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
