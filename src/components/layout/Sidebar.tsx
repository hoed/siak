
import React, { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
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
      icon: <Settings size={20} />, 
      name: 'Pengaturan', 
      path: '/settings',
      roles: ['admin', 'manager', 'user']
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Classes for the sidebar
  const sidebarClasses = cn(
    "h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 overflow-hidden",
    isOpen ? "w-64" : "w-16",
    isMobile && isOpen ? "fixed z-40 shadow-xl" : "",
    isMobile && !isOpen ? "w-0 border-none" : ""
  );

  const menuToggleButton = (
    <button 
      onClick={toggleSidebar}
      className={cn(
        "md:hidden fixed z-50 bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg",
        isOpen && isMobile ? "right-[270px]" : "right-4"
      )}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  return (
    <>
      {menuToggleButton}
      <div className={sidebarClasses}>
        {/* Logo and app name */}
        <div className={cn(
          "p-6 flex items-center",
          isOpen ? "justify-center" : "justify-center"
        )}>
          <Wallet className="text-primary" size={28} />
          {isOpen && <h1 className="ml-2 text-xl font-bold">SisKeu</h1>}
        </div>

        {/* User profile area */}
        {isOpen && (
          <div className="px-6 py-4 border-t border-b border-sidebar-border">
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

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className={cn("space-y-1", isOpen ? "px-3" : "px-2")}>
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    !isOpen && "justify-center px-2"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <span className={cn(!isOpen && "mx-0")}>{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className={cn("p-4 border-t border-sidebar-border", !isOpen && "flex justify-center")}>
          <button
            onClick={logout}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent/50 transition-colors",
              !isOpen && "justify-center px-2 w-10 h-10"
            )}
            title={!isOpen ? 'Keluar' : undefined}
          >
            <LogOut size={20} className={cn(!isOpen && "mx-0")} />
            {isOpen && <span className="ml-3">Keluar</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
