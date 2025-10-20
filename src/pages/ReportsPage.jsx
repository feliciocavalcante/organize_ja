// src/pages/ReportsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Importe o supabase
import MonthlyBarChart from '../dashboardComponents/Charts/MonthlyBarChart'; // Importe o gráfico

function ReportsPage() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Verificar se o usuário está logado
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [navigate]);

  // 2. Buscar as transações (APENAS se o usuário existir)
  useEffect(() => {
    const fetchTransactions = async (userId) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('user_id', userId)
        .order('data', { ascending: true }); // Ordena da mais antiga para a mais nova

      if (error) {
        console.error('Erro ao buscar transações:', error);
        setError(error.message);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchTransactions(user.id);
    }
  }, [user]); // Roda sempre que o 'user' for definido


  // 3. Renderizar a página
  return (
    // 'p-8' adiciona um padding que combina com o Header/Sidebar
    <div className="p-8">
      
      <h1 className="text-3xl font-bold text-white mb-6">
        Relatório Mensal
      </h1>
      
      <p className="text-lg text-gray-300 mb-8">
        Veja a evolução de suas entradas e saídas ao longo dos meses.
      </p>

      {/* Card que envolve o gráfico */}
      <div className="w-full max-w-6xl mx-auto">
        {loading && (
          <div className="text-center text-cyan-400 p-10">
            Carregando dados do relatório...
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 p-10">
            Erro ao carregar dados: {error}
          </div>
        )}

        {!loading && !error && (
          <MonthlyBarChart transactions={transactions} />
        )}
      </div>
      
    </div>
  );
}

export default ReportsPage;