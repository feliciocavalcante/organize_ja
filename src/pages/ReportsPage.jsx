// src/pages/ReportsPage.jsx

import React, { useState, useEffect } from 'react'; // REMOVIDO useState, useEffect não são mais necessários para buscar transações
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import MonthlyBarChart from '../dashboardComponents/Charts/MonthlyBarChart';
import { useTransactions } from '../context/TransactionContext'; // 1. IMPORTAR O HOOK

function ReportsPage() {
    // REMOVIDO: States locais de user, transactions, loading, error
    // const [user, setUser] = useState(null);
    // const [transactions, setTransactions] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate ainda é necessário para segurança

    // 2. USAR O HOOK DO CONTEXTO
    const { 
        transactions, 
        loading, // Loading das transações do contexto
        error,   // Erro das transações do contexto
        user     // Usuário do contexto
    } = useTransactions();

    // REMOVIDO: useEffect para fetchUser
    // useEffect(() => { /* ... */ }, [navigate]);

    // REMOVIDO: useEffect para fetchTransactions
    // useEffect(() => { /* ... */ }, [user]);

    // ADICIONADO: useEffect simples para verificar se há usuário (segurança)
    // Se o contexto ainda não carregou o usuário, redireciona
    useEffect(() => {
        // Pequeno delay para dar tempo ao contexto
        const timer = setTimeout(() => {
            if (!user && !loading) { // Se não está carregando e não tem user
                navigate('/auth');
            }
        }, 100); // Espera 100ms
        
        return () => clearTimeout(timer); // Limpa o timer
    }, [user, loading, navigate]);


    // 3. Renderizar a página usando dados do contexto
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">
                Relatório Mensal
            </h1>
            <p className="text-lg text-gray-300 mb-8">
                Veja a evolução de suas entradas e saídas ao longo dos meses.
            </p>

            <div className="w-full max-w-6xl mx-auto">
                {/* Usa 'loading' do contexto */}
                {loading && (
                    <div className="text-center text-cyan-400 p-10">
                        Carregando dados do relatório...
                    </div>
                )}

                {/* Usa 'error' do contexto */}
                {error && (
                    <div className="text-center text-red-400 p-10">
                        Erro ao carregar dados: {error}
                    </div>
                )}

                {/* Passa 'transactions' do contexto para o gráfico */}
                {/* Adiciona verificação !loading e !error */}
                {!loading && !error && (
                    <MonthlyBarChart transactions={transactions || []} /> // Garante que é um array
                )}
            </div>
        </div>
    );
}

export default ReportsPage;