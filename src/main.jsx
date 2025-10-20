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
// (No futuro, você vai criar e importar a TransactionsPage e SettingsPage)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        
        {/* Rota da Landing Page (pública) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rota de Login/Cadastro (pública) */}
        <Route path="/auth" element={<LoginPage />} />
        
        {/* LAYOUT PRINCIPAL DO APP (Rotas Protegidas)
          Tudo que estiver aqui dentro terá o Sidebar!
        */}
        <Route path="/dashboard" element={<AppLayout />}>
          
          {/* 'index' significa que esta é a rota padrão de /dashboard */}
          <Route index element={<DashboardPage />} /> 
          
          {/* /dashboard/relatorios */}
          <Route path="relatorios" element={<ReportsPage />} />

         <Route path="transacoes" element={<TransactionsPage />} />
         <Route path="configuracoes" element={<SettingsPage />} />

        </Route>
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);