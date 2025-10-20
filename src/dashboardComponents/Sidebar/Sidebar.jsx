// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom'; 

import logBlack from '../../assets/logBlack.png'; 
import { RxDashboard } from "react-icons/rx";
import { GoArrowSwitch } from "react-icons/go";
import { IoAnalytics } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

// 1. Aceitar as props 'isMobileMenuOpen' e 'setIsMobileMenuOpen'
function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  
  const getLinkClass = ({ isActive }) => {
    // ... (sua função getLinkClass continua igual) ...
    const baseClasses = "flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 no-underline";
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} text-gray-800 hover:bg-gray-100`;
  };

  // 2. Lógica de classes para esconder/mostrar no mobile
  const mobileTransform = isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    // 3. Usamos um Fragment (<>) para ter o Sidebar e o Backdrop
    <>
      {/* Backdrop (sombra preta que fecha o menu ao clicar) */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity
                    ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* 4. O Sidebar em si */}
      <nav className={`w-[250px] h-screen fixed left-0 top-0 
                      bg-white border-r border-gray-200 
                      p-6 flex flex-col shadow-md
                      z-30 transition-transform duration-300 ease-in-out
                      ${mobileTransform} md:translate-x-0`} // 5. Classes mágicas!
      >
        
        {/* --- Logo --- */}
        <div className="text-center mb-10">
          <img 
            src={logBlack} 
            alt="Organize Já Logo" 
            className="w-full max-w-[160px] h-auto mx-auto" 
          />
        </div>

        {/* --- Menu de Navegação (continua igual) --- */}
        <ul className="list-none p-0 m-0 flex flex-col gap-3">
          <li>
            <NavLink to="/dashboard" end className={getLinkClass}>
              <RxDashboard className="text-xl mr-4" />
              <span className="font-semibold text-base">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/transacoes" className={getLinkClass}>
              <GoArrowSwitch className="text-xl mr-4" />
              <span className="font-medium text-base">Transações</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/relatorios" className={getLinkClass}>
              <IoAnalytics className="text-xl mr-4" />
              <span className="font-medium text-base">Relatórios</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/configuracoes" className={getLinkClass}>
              <IoSettingsOutline className="text-xl mr-4" />
              <span className="font-medium text-base">Configurações</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;