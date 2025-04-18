
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      {!isMobile && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onOpenChange={setSidebarOpen} 
          className="hidden md:flex transition-all duration-300 ease-in-out"
        />
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
