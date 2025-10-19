import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Importe as novas páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
// Recomendo renomear sua landing page para HomePage
import HomePage from './pages/HomePage'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota da Landing Page (pública) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rota de Login/Cadastro (pública) */}
        <Route path="/auth" element={<LoginPage />} />
        
        {/* Rota do Dashboard (PROTEGIDA, será implementada na Fase 4) */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);