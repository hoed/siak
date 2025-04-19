
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lazy loaded components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Journals = lazy(() => import('@/pages/Journals'));
const Ledger = lazy(() => import('@/pages/Ledger'));
const TaxReports = lazy(() => import('@/pages/TaxReports'));
const Income = lazy(() => import('@/pages/Income'));
const Expenses = lazy(() => import('@/pages/Expenses'));
const ChartOfAccounts = lazy(() => import('@/pages/ChartOfAccounts'));
const Reports = lazy(() => import('@/pages/Reports'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user: null, isLoading: false }}>
        <Router>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Memuat...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="/journals" element={<Journals />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/tax-reports" element={<TaxReports />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </AuthContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
