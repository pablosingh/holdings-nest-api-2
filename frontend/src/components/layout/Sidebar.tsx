const navItems = [
  { label: 'Usuarios', path: 'users' },
  { label: 'Criptos', path: 'criptos' },
  { label: 'Holdings', path: 'holdings' },
  { label: 'Operaciones', path: 'operations' },
] as const;

interface SidebarProps {
  active: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold tracking-wide">Holdings</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              active === item.path
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
