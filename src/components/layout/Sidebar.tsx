import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wallet } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      name: 'Dashboard', 
      path: '/dashboard',
      roles: ['admin', 'manager']
    },
    { 
      icon: <Settings size={20} />, 
      name: 'Settings', 
      path: '/settings',
      roles: ['admin', 'manager']
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="h-screen bg-sidebar text-sidebar-foreground w-64 flex flex-col border-r border-sidebar-border">
      {/* Logo and app name */}
      <div className="p-6 flex items-center justify-center">
        <Wallet className="mr-2 text-primary" size={28} />
        <h1 className="text-xl font-bold">WealthWise</h1>
      </div>

      {/* User profile area */}
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
            <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;