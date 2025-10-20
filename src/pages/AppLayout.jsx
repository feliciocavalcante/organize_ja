// src/pages/AppLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboardComponents/Sidebar/Sidebar.jsx';
import Header from '../dashboardComponents/header/Header.jsx'; // 1. Importar o Header

function AppLayout() {
  return (
    // Fundo aplicado aqui para cobrir a tela inteira
    <div className="flex min-h-screen bg-gray-900">
      
      <Sidebar />

      {/* Wrapper para o conteúdo principal (Header + Outlet) */}
      <div className="flex-1 ml-[250px] flex flex-col">
        
        <Header /> {/* 2. Adicionar o Header aqui */}

        {/* O Outlet agora fica dentro de uma tag 'main' para crescer */}
        <main className="flex-1">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}

export default AppLayout;