import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  BarChart2,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Layers,
  Menu,
  Package,
  PieChart,
  Receipt,
  Settings,
  TrendingDown,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const navigationItems = [
  { name: 'Dasbor', path: '/dashboard', icon: Home, role: ['user', 'admin', 'manager', 'accountant'] },
  { name: 'Bagan Akun', path: '/chart-of-accounts', icon: PieChart, role: ['admin', 'manager', 'accountant'] },
  { name: 'Pendapatan', path: '/income', icon: TrendingUp, role: ['user', 'admin', 'manager', 'accountant'] },
  { name: 'Pengeluaran', path: '/expenses', icon: TrendingDown, role: ['user', 'admin', 'manager', 'accountant'] },
  { name: 'Transaksi', path: '/transactions', icon: FileText, role: ['user', 'admin', 'manager', 'accountant'] },
  { name: 'Jurnal', path: '/journals', icon: BookOpen, role: ['admin', 'manager', 'accountant'] },
  { name: 'Buku Besar', path: '/ledger', icon: BookOpen, role: ['admin', 'manager', 'accountant'] },
  { name: 'Inventaris', path: '/inventory', icon: Package, role: ['admin', 'manager', 'accountant'] },
  { name: 'Utang', path: '/debts', icon: CreditCard, role: ['admin', 'manager', 'accountant'] },
  { name: 'Piutang', path: '/receivables', icon: CreditCard, role: ['admin', 'manager', 'accountant'] },
  { name: 'Akun', path: '/accounts', icon: Layers, role: ['admin', 'manager', 'accountant'] },
  { name: 'Laporan', path: '/reports', icon: BarChart2, role: ['admin', 'manager', 'accountant'] },
  { name: 'Laporan Pajak', path: '/tax-reports', icon: Receipt, role: ['admin', 'manager', 'accountant'] },
  { name: 'Kategori', path: '/categories', icon: Calendar, role: ['admin', 'manager', 'accountant'] },
  { name: 'Pengguna', path: '/users', icon: UserCog, role: ['admin'] },
  { name: 'Pelanggan', path: '/customers', icon: Users, role: ['admin', 'manager', 'accountant'] },
  { name: 'Pemasok', path: '/suppliers', icon: Users, role: ['admin', 'manager', 'accountant'] },
  { name: 'Pengaturan', path: '/settings', icon: Settings, role: ['admin', 'manager', 'accountant'] },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(!isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarClasses = cn(
    'sidebar h-screen flex flex-col border-r border-gray-200 transition-all duration-300 bg-blue-500 dark:bg-gray-800 text-white',
    isOpen ? 'w-64' : 'w-16',
    isMobile && isOpen ? 'fixed z-40 shadow-xl' : '',
    isMobile && !isOpen ? 'w-0 border-none' : ''
  );

  // If there's no user yet, show a default sidebar with limited options
  const filteredItems = user
    ? navigationItems.filter(item => user.role && item.role.includes(user.role))
    : navigationItems.filter(item => item.path === '/dashboard' || item.path === '/login' || item.path === '/register');

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-blue-500 text-white hover:bg-blue-600"
        >
          <Menu size={20} />
        </Button>
      )}

      <div className={sidebarClasses} data-sidebar="true">
        <div className="flex items-center justify-between p-4 border-b border-blue-600 dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center">
              <Wallet className="h-6 w-6 mr-2 text-white" />
              <span className="text-lg font-semibold text-white">Finance System</span>
            </div>
          ) : (
            <Wallet className="h-6 w-6 text-white mx-auto" />
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-blue-600"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-hidden pt-2">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <ul className="space-y-1 p-2">
              {filteredItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center p-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-white hover:bg-blue-600'
                      )
                    }
                  >
                    <item.icon className={cn('h-5 w-5', isOpen ? 'mr-3' : 'mr-0')} />
                    {isOpen && <span>{item.name}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
