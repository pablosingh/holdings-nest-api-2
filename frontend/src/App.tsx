import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { UsersPage } from './components/users/UsersPage';
import { CriptosPage } from './components/criptos/CriptosPage';
import { HoldingsPage } from './components/holdings/HoldingsPage';
import { OperationsPage } from './components/operations/OperationsPage';
import { RegisterPage } from './components/register/RegisterPage';
import { LoginPage } from './components/login/LoginPage';
import type { AuthUser } from './types';

type View = 'users' | 'criptos' | 'holdings' | 'operations' | 'register';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeView, setActiveView] = useState<View>('users');

  if (!user) {
    return <LoginPage onLogin={(u) => setUser(u)} />;
  }

  const renderPage = () => {
    switch (activeView) {
      case 'users': return <UsersPage />;
      case 'criptos': return <CriptosPage />;
      case 'holdings': return <HoldingsPage />;
      case 'operations': return <OperationsPage />;
      case 'register': return <RegisterPage />;
    }
  };

  return (
    <div className="flex">
      <Sidebar active={activeView} onNavigate={(p) => setActiveView(p as View)} onLogout={() => setUser(null)} />
      <main className="flex-1 bg-gray-100 p-8">
        {renderPage()}
      </main>
    </div>
  );
}
