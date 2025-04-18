
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import RequireAuth from '@/contexts/auth/RequireAuth';
import CreateTestUsers from '@/contexts/auth/CreateTestUsers';

import './App.css';

// Pages
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Accounts from '@/pages/Accounts';
import Income from '@/pages/Income';
import Expenses from '@/pages/Expenses';
import Receivables from '@/pages/Receivables';
import Debts from '@/pages/Debts';
import Categories from '@/pages/Categories';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Customers from '@/pages/Customers';
import Suppliers from '@/pages/Suppliers';
import Users from '@/pages/Users';
import Inventory from '@/pages/Inventory';
import ChartOfAccounts from '@/pages/ChartOfAccounts';
import Transactions from '@/pages/Transactions';
import Journals from '@/pages/Journals';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="keuangan-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/accounts" 
                element={
                  <RequireAuth>
                    <Accounts />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/income" 
                element={
                  <RequireAuth>
                    <Income />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/expenses" 
                element={
                  <RequireAuth>
                    <Expenses />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/receivables" 
                element={
                  <RequireAuth>
                    <Receivables />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/debts" 
                element={
                  <RequireAuth>
                    <Debts />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/categories" 
                element={
                  <RequireAuth>
                    <Categories />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <RequireAuth>
                    <Reports />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/customers" 
                element={
                  <RequireAuth>
                    <Customers />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/suppliers" 
                element={
                  <RequireAuth>
                    <Suppliers />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <RequireAuth>
                    <Users />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <RequireAuth>
                    <Inventory />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/chart-of-accounts" 
                element={
                  <RequireAuth>
                    <ChartOfAccounts />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <RequireAuth>
                    <Transactions />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/journals" 
                element={
                  <RequireAuth>
                    <Journals />
                  </RequireAuth>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <CreateTestUsers />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
