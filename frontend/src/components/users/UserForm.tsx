import { useState, useEffect } from 'react';
import type { User, CreateUserDto } from '../../types';

interface Props {
  editingUser: User | null;
  onSubmit: (data: CreateUserDto) => void;
  onCancel: () => void;
}

export function UserForm({ editingUser, onSubmit, onCancel }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(editingUser?.name ?? '');
    setEmail(editingUser?.email ?? '');
    setPassword('');
  }, [editingUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (!editingUser && !password.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim(), password: password.trim() || 'default123' });
    setName(''); setEmail(''); setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" required={!editingUser} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{editingUser ? 'Actualizar' : 'Crear'}</button>
        {editingUser && <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Cancelar</button>}
      </div>
    </form>
  );
}
