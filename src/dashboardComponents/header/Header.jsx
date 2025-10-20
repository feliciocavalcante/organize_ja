// src/components/Header/Header.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { LogOut, Menu } from 'lucide-react'; // 1. Importar o ícone 'Menu'

// 2. Aceitar a prop 'setIsMobileMenuOpen'
function Header({ setIsMobileMenuOpen }) {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ... (toda a sua lógica de fetchUserData continua igual) ...
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setFullName(user.email); 
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (!error && profile && profile.full_name) {
        setFullName(profile.full_name);
      }
      setLoading(false);
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    // ... (sua lógica de handleLogout continua igual) ...
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const firstName = fullName.split(' ')[0];

  return (
    // 3. Mudar para 'justify-between' e 'px-4' no mobile
    <header className="sticky top-0 z-10 
                       h-20 flex items-center justify-between 
                       bg-gray-900 
                       border-b border-gray-700 
                       px-4 md:px-8" // Padding menor no mobile
    >
      {/* 4. Lado Esquerdo: Ícone de Hamburger (SÓ no mobile) */}
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)} // 5. Ação de clique
          className="md:hidden text-gray-300 hover:text-white p-2 -ml-2"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 6. Lado Direito: "Olá" e "Sair" (continua igual) */}
      <div className="flex items-center gap-6">
        {loading ? (
          <span className="text-sm text-gray-400">Carregando...</span>
        ) : (
          <span className="text-md font-medium text-white">
            Olá, {firstName}!
          </span>
        )}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 
                     text-gray-400 hover:text-white 
                     transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </header>
  );
}

export default Header;