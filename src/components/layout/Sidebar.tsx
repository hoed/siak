import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart, 
  ArrowLeftRight, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Users, 
  FileText, 
  Settings,
  CreditCard,
  Calendar,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  User,
  Truck,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      name: 'Dashboard', 
      path: '/dashboard',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <Package size={20} />, 
      name: 'Inventory', 
      path: '/inventory',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <BookOpen size={20} />, 
      name: 'Bagan Akun', 
      path: '/chart-of-accounts',
      roles: ['admin', 'manager']
    },
    { 
      icon: <ArrowUpCircle size={20} />, 
      name: 'Pendapatan', 
      path: '/income',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <ArrowDownCircle size={20} />, 
      name: 'Pengeluaran', 
      path: '/expenses',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <ArrowLeftRight size={20} />, 
      name: 'Transaksi', 
      path: '/transactions',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <Calendar size={20} />, 
      name: 'Hutang', 
      path: '/debts',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <Calendar size={20} />, 
      name: 'Piutang', 
      path: '/receivables',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <CreditCard size={20} />, 
      name: 'Akun Bank', 
      path: '/accounts',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <FileText size={20} />, 
      name: 'Laporan', 
      path: '/reports',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <PieChart size={20} />, 
      name: 'Kategori', 
      path: '/categories',
      roles: ['admin', 'manager']
    },
    { 
      icon: <Users size={20} />, 
      name: 'Pengguna', 
      path: '/users',
      roles: ['admin']
    },
    { 
      icon: <User size={20} />, 
      name: 'Pelanggan', 
      path: '/customers',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <Truck size={20} />, 
      name: 'Pemasok', 
      path: '/suppliers',
      roles: ['admin', 'manager', 'user']
    },
    { 
      icon: <Settings size={20} />, 
      name: 'Pengaturan', 
      path: '/settings',
      roles: ['admin', 'manager', 'user']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className={cn(
      "h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center">
          <Wallet className="text-primary" size={28} />
          {!isCollapsed && <h1 className="ml-2 text-xl font-bold">SisKeu</h1>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hidden md:flex"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role === 'admin' ? 'Administrator' : user?.role === 'manager' ? 'Manajer' : 'Pengguna'}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn(
        "p-4 border-t border-sidebar-border",
        isCollapsed && "flex justify-center"
      )}>
        <button
          onClick={logout}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent/50 transition-colors w-full",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? 'Keluar' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-3">Keluar</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
