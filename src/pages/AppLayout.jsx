// src/pages/AppLayout.jsx

import React, { useState } from 'react'; // 1. Importar o useState
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboardComponents/Sidebar/Sidebar';
import Header from '../dashboardComponents/header/Header';
import { Toaster } from 'react-hot-toast';
import { TransactionProvider } from '../context/TransactionContext';

function AppLayout() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">

      {/* 2. ADICIONAR O COMPONENTE 
          Ele vai "ouvir" e exibir qualquer 'toast' chamado no app.
      */}
      <Toaster
        position="top-right" // Posição (canto superior direito)
        toastOptions={{
          // Estilos padrão para o dark mode
          style: {
            background: '#333', // Fundo cinza escuro
            color: '#fff', // Texto branco
          },
        }}
      />

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* O resto do seu layout continua igual */}
      <div className="flex-1 w-full md:ml-[250px] flex flex-col">


        <TransactionProvider>
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}/>
          <Outlet />
        </TransactionProvider>

      </div>
    </div>
  );
}

export default AppLayout;