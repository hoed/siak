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
  Package,
  PieChart,
  Settings,
  TrendingDown,
  TrendingUp,
  UserCog,
  Users,
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
  { name: 'Inventaris', path: '/inventory', icon: Package, role: ['admin', 'manager', 'accountant'] },
  { name: 'Utang', path: '/debts', icon: CreditCard, role: ['admin', 'manager', 'accountant'] },
  { name: 'Piutang', path: '/receivables', icon: CreditCard, role: ['admin', 'manager', 'accountant'] },
  { name: 'Akun', path: '/accounts', icon: Layers, role: ['admin', 'manager', 'accountant'] },
  { name: 'Laporan', path: '/reports', icon: BarChart2, role: ['admin', 'manager', 'accountant'] },
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
    'sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 overflow-hidden',
    isOpen ? 'w-64' : 'w-16',
    isMobile && isOpen ? 'fixed z-40 shadow-xl' : '',
    isMobile && !isOpen ? 'w-0 border-none' : ''
  );

  return (
    <div
      className={sidebarClasses}
      data-sidebar="true"
      style={{ backgroundColor: '#3399FF !important', color: '#FFFFFF !important' }}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && <span className="text-lg font-semibold text-sidebar-foreground">SisKeu</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2">
          {navigationItems
            .filter((item) => user && item.role.includes(user.role))
            .map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center p-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )
                  }
                >
                  <item.icon className={cn('h-5 w-5', isOpen ? 'mr-3' : 'mr-0')} />
                  {isOpen && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;