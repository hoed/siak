
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function Sidebar({ className, isOpen = true, onOpenChange }: SidebarProps) {
  const location = useLocation();
  const isMobile = useMobile();
  const [collapsed, setCollapsed] = useState(false);

  // Update local collapsed state when isOpen prop changes
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

  // Set sidebarWidth based on collapsed state
  const sidebarWidth = collapsed ? 'w-16' : 'w-64';
  
  // Define icon size based on collapsed state
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
            ? "bg-accent text-accent-foreground font-medium" 
            : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
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
    <div className={cn("h-screen bg-card border-r", sidebarWidth, "transition-all duration-300 ease-in-out", className)}>
      <div className="flex flex-col h-full">
        <div className="p-3">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <Link to="/dashboard" className="flex items-center">
                <span className="text-xl font-bold">Keuangan</span>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("ml-auto", collapsed && "mx-auto")}
              onClick={toggleCollapsed}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 px-3 py-2 overflow-y-auto">
          <nav className="space-y-1">
            {/* Dashboard */}
            {renderNavItem("/dashboard", "Dashboard", <Home className={iconSize} />)}
            
            {/* Transactions */}
            {renderNavItem("/transactions", "Transaksi", <CircleDollarSign className={iconSize} />, true)}
            
            {/* Income */}
            {renderNavItem("/income", "Pemasukan", <ArrowUpRight className={iconSize} />)}
            
            {/* Expenses */}
            {renderNavItem("/expenses", "Pengeluaran", <ArrowDownRight className={iconSize} />)}
            
            {/* Accounts */}
            {renderNavItem("/accounts", "Akun Bank", <CreditCard className={iconSize} />, true)}
            
            {/* Receivables */}
            {renderNavItem("/receivables", "Piutang", <Receipt className={iconSize} />)}
            
            {/* Debts */}
            {renderNavItem("/debts", "Hutang", <PiggyBank className={iconSize} />)}
            
            {/* Inventory */}
            {renderNavItem("/inventory", "Inventaris", <PackageOpen className={iconSize} />, true)}
            
            {/* Chart of Accounts */}
            {renderNavItem("/chart-of-accounts", "Bagan Akun", <Layers3 className={iconSize} />)}
            
            {/* Journals */}
            {renderNavItem("/journals", "Jurnal", <BookOpen className={iconSize} />)}
            
            {/* Categories */}
            {renderNavItem("/categories", "Kategori", <Tags className={iconSize} />, true)}
            
            {/* Customers */}
            {renderNavItem("/customers", "Pelanggan", <UserCircle className={iconSize} />)}
            
            {/* Suppliers */}
            {renderNavItem("/suppliers", "Pemasok", <Users className={iconSize} />)}
            
            {/* Reports */}
            {renderNavItem("/reports", "Laporan", <BarChart3 className={iconSize} />, true)}
            
            {/* Settings */}
            {renderNavItem("/settings", "Pengaturan", <Settings className={iconSize} />, true)}
          </nav>
        </div>
      </div>
    </div>
  );
}
