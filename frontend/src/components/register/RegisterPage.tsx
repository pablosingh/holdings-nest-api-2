import { useState } from 'react';
import { usersApi } from '../../api/users';
import { UserForm } from '../users/UserForm';
import type { CreateUserDto } from '../../types';

export function RegisterPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserDto) => {
    try {
      await usersApi.create(data);
      setSuccess('Usuario creado correctamente');
      setError(null);
    } catch {
      setError('Error al crear usuario');
      setSuccess(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Registrarse</h1>
      {success && <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">{success}</div>}
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
