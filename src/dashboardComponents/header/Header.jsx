// src/components/Header/Header.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { LogOut, Menu } from 'lucide-react';

function Header({ setIsMobileMenuOpen }) {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setFullName(user.email); // Define o email como fallback (plano B)

      // --- INÍCIO DA CORREÇÃO ---
      // Trocamos .single() por uma busca de lista, que não quebra.
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id); // Busca uma LISTA

      // Verificamos se a lista veio e se tem pelo menos 1 item
      if (!error && profiles && profiles.length > 0) {
        const profile = profiles[0]; // Pegamos o primeiro item
        if (profile.full_name) {
          setFullName(profile.full_name); // Atualiza o nome
        }
      }
      // Se 'profiles' estiver vazio, o app não quebra e só mostra o email.
      // --- FIM DA CORREÇÃO ---

      setLoading(false);
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const firstName = fullName.split(' ')[0];

  return (
    <header className="sticky top-0 z-10 
                       h-20 flex items-center justify-between 
                       bg-gray-900 
                       border-b border-gray-700 
                       px-4 md:px-8"
    >
      {/* Lado Esquerdo: Ícone de Hamburger */}
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="md:hidden text-gray-300 hover:text-white p-2 -ml-2"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Lado Direito: "Olá" e "Sair" */}
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