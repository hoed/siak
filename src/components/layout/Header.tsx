
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, BellRing, UserCircle, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { setTheme, theme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfile = () => {
    navigate('/settings');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Beralih Menu</span>
      </Button>
      <div className="ml-auto flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Beralih Tema</span>
        </Button>
        <Button variant="ghost" size="icon">
          <BellRing className="h-5 w-5" />
          <span className="sr-only">Notifikasi</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleProfile}>
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">Profil</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Keluar</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
