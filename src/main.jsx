// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Importe as páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';

// Importe os NOVOS componentes de layout
import AppLayout from './pages/AppLayout';
import ReportsPage from './pages/ReportsPage';
import TransactionsPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';
import CheckoutPage from './pages/CheckoutPage';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="relatorios" element={<ReportsPage />} />
          <Route path="transacoes" element={<TransactionsPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);