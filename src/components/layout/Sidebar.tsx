import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Home, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  UserCircle, 
  Tags,
  PackageOpen,
  PiggyBank,
  FileText,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Layers3,
  BookOpen
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function Sidebar({ className, isOpen = true, onOpenChange }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setCollapsed(!isOpen);
    }
  }, [isOpen, isMobile]);

  const toggleCollapsed = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    
    if (onOpenChange) {
      onOpenChange(!newCollapsedState);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';
  
  const iconSize = collapsed ? 'h-5 w-5' : 'h-4 w-4';

  const renderNavItem = (
    path: string, 
    label: string, 
    icon: React.ReactNode, 
    isSection: boolean = false
  ) => {
    const active = isActive(path);
    
    const item = (
      <Link
        to={path}
        className={cn(
          "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
          active 
            ? "bg-primary/20 text-white font-medium" 
            : "hover:bg-primary/10 text-gray-200 hover:text-white",
          collapsed && "justify-center px-0",
          isSection && "mt-6"
        )}
      >
        <span className={cn("mr-2", collapsed && "mr-0", iconSize)}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {item}
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2 bg-secondary">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return item;
  };

  return (
    <div className={cn(
      "group/sidebar relative h-screen bg-sidebar border-r border-sidebar-border",
      sidebarWidth,
      "transition-all duration-300 ease-in-out",
      "overflow-visible",
      className
    )}>
      <div className="flex flex-col h-full">
        <div className="p-3">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <Link to="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-white">Keuangan</span>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("ml-auto text-white hover:bg-primary/20", collapsed && "mx-auto")}
              onClick={toggleCollapsed}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 space-y-1 overflow-x-hidden">
          <nav className="px-3">
            {renderNavItem("/dashboard", "Beranda", <Home className={iconSize} />)}
            {renderNavItem("/transactions", "Transaksi", <CircleDollarSign className={iconSize} />, true)}
            {renderNavItem("/income", "Pemasukan", <ArrowUpRight className={iconSize} />)}
            {renderNavItem("/expenses", "Pengeluaran", <ArrowDownRight className={iconSize} />)}
            {renderNavItem("/accounts", "Akun Bank", <CreditCard className={iconSize} />, true)}
            {renderNavItem("/receivables", "Piutang", <Receipt className={iconSize} />)}
            {renderNavItem("/debts", "Hutang", <PiggyBank className={iconSize} />)}
            {renderNavItem("/inventory", "Inventaris", <PackageOpen className={iconSize} />, true)}
            {renderNavItem("/chart-of-accounts", "Bagan Akun", <Layers3 className={iconSize} />)}
            {renderNavItem("/journals", "Jurnal", <BookOpen className={iconSize} />)}
            {renderNavItem("/categories", "Kategori", <Tags className={iconSize} />, true)}
            {renderNavItem("/customers", "Pelanggan", <UserCircle className={iconSize} />)}
            {renderNavItem("/suppliers", "Pemasok", <Users className={iconSize} />)}
            {renderNavItem("/reports", "Laporan", <BarChart3 className={iconSize} />, true)}
            {renderNavItem("/settings", "Pengaturan", <Settings className={iconSize} />, true)}
          </nav>
        </div>
      </div>
    </div>
  );
}
