import type { User } from '../../types';

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
}

export function UserList({ users, onEdit, onDelete }: Props) {
  if (!users.length) {
    return <p className="py-8 text-center text-gray-500">No hay usuarios.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{u.id}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{u.email}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                <button onClick={() => onEdit(u)} className="mr-2 rounded bg-indigo-100 px-3 py-1 text-indigo-700 hover:bg-indigo-200">Editar</button>
                <button onClick={() => onDelete(u.id)} className="rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
