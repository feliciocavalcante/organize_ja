// src/components/Header/Header.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Ajuste o caminho se necessário
import { LogOut } from 'lucide-react';

function Header() {
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
      
      // Pega o email como fallback
      setFullName(user.email); 

      // Tenta buscar o nome completo no profile
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
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const firstName = fullName.split(' ')[0];

  return (
    <header className="sticky top-0 z-10 
                       h-20 flex items-center justify-end 
                       bg-gray-900 
                       border-b border-gray-700 
                       px-8"
    >
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
                     transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 " />
          <span className="text-sm font-medium ">Sair</span>
        </button>
      </div>
    </header>
  );
}

export default Header;