import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../../api/users';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import type { User, CreateUserDto } from '../../types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try { setUsers(await usersApi.getAll()); setError(null); }
    catch { setError('Error al conectar con el servidor'); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async (data: CreateUserDto) => {
    try { await usersApi.create(data); await fetch(); }
    catch { setError('Error al guardar usuario'); }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Usuarios</h1>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <UserForm onSubmit={handleCreate} />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}
