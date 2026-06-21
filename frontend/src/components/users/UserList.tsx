import type { User } from '../../types';

interface Props {
  users: User[];
}

export function UserList({ users }: Props) {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{u.id}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
