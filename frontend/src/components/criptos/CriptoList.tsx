import type { Cripto } from '../../types';

interface Props {
  criptos: Cripto[];
}

export function CriptoList({ criptos }: Props) {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {criptos.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{c.id}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{c.ticker}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">${parseFloat(c.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
