

import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import MonthlyBarChart from '../dashboardComponents/Charts/MonthlyBarChart';
import { useTransactions } from '../context/TransactionContext'; 

function ReportsPage() {
   
    const navigate = useNavigate(); 

   
    const { 
        transactions, 
        loading, 
        error,   
        user     
    } = useTransactions();

    
    useEffect(() => {

        const timer = setTimeout(() => {
            if (!user && !loading) {
            }
        }, 100); 
        
        return () => clearTimeout(timer); 
    }, [user, loading, navigate]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">
                Relatório Mensal
            </h1>
            <p className="text-lg text-gray-300 mb-8">
                Veja a evolução de suas entradas e saídas ao longo dos meses.
            </p>

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
                    <MonthlyBarChart transactions={transactions || []} /> 
                )}
            </div>
        </div>
    );
}

export default ReportsPage;