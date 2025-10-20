// src/pages/AppLayout.jsx

import React, { useState } from 'react'; // 1. Importar o useState
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboardComponents/Sidebar/Sidebar';
import Header from '../dashboardComponents/header/Header'; 

function AppLayout() {
  
  // 2. Adicionar o state para controlar o menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">
      
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} // 3. Passar o state para o Sidebar
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* 4. O conteúdo principal agora é 100% no mobile e tem margem no desktop */}
      <div className="flex-1 w-full md:ml-[250px] flex flex-col">
        
        <Header 
          setIsMobileMenuOpen={setIsMobileMenuOpen} // 5. Passar o "setter" para o Header
        />

        <main className="flex-1">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}

export default AppLayout;