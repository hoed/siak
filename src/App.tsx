
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./contexts/auth";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import NotFound from "./pages/NotFound";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Transactions from "./pages/Transactions";
import Debts from "./pages/Debts";
import Receivables from "./pages/Receivables";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Inventory from "./pages/Inventory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/chart-of-accounts" element={
              <RequireAuth>
                <ChartOfAccounts />
              </RequireAuth>
            } />
            <Route path="/income" element={
              <RequireAuth>
                <Income />
              </RequireAuth>
            } />
            <Route path="/expenses" element={
              <RequireAuth>
                <Expenses />
              </RequireAuth>
            } />
            <Route path="/transactions" element={
              <RequireAuth>
                <Transactions />
              </RequireAuth>
            } />
            <Route path="/debts" element={
              <RequireAuth>
                <Debts />
              </RequireAuth>
            } />
            <Route path="/receivables" element={
              <RequireAuth>
                <Receivables />
              </RequireAuth>
            } />
            <Route path="/accounts" element={
              <RequireAuth>
                <Accounts />
              </RequireAuth>
            } />
            <Route path="/reports" element={
              <RequireAuth>
                <Reports />
              </RequireAuth>
            } />
            <Route path="/categories" element={
              <RequireAuth>
                <Categories />
              </RequireAuth>
            } />
            <Route path="/users" element={
              <RequireAuth requiredRole="admin">
                <Users />
              </RequireAuth>
            } />
            <Route path="/customers" element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            } />
            <Route path="/suppliers" element={
              <RequireAuth>
                <Suppliers />
              </RequireAuth>
            } />
            <Route path="/inventory" element={
              <RequireAuth>
                <Inventory />
              </RequireAuth>
            } />
            <Route path="/settings" element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
