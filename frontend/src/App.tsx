import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { UsersPage } from './components/users/UsersPage';
import { CriptosPage } from './components/criptos/CriptosPage';
import { HoldingsPage } from './components/holdings/HoldingsPage';
import { OperationsPage } from './components/operations/OperationsPage';
import { RegisterPage } from './components/register/RegisterPage';
import { LoginPage } from './components/login/LoginPage';
import { useAuth } from './auth/AuthContext';

type View = 'users' | 'criptos' | 'holdings' | 'operations' | 'register';

export default function App() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<View>('users');

  if (!user) {
    return <LoginPage />;
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
      <Sidebar active={activeView} onNavigate={(p) => setActiveView(p as View)} onLogout={logout} />
      <main className="flex-1 bg-gray-100 p-8">
        {renderPage()}
      </main>
    </div>
  );
}
