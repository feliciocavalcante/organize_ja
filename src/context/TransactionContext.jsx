// src/context/TransactionContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // Ajuste o caminho se necessário

// 1. Cria o Contexto
const TransactionContext = createContext();

// 2. Cria o Provedor (Componente que vai envolver o App)
export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // Precisamos saber quem está logado

    // Função para buscar o usuário (semelhante às páginas)
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            // Poderíamos adicionar um loading de usuário aqui se quisesse
        };
        fetchUser();
        
        // Ouve mudanças na autenticação (login/logout)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              setUser(session?.user ?? null);
            }
          );
      
          // Limpa o listener ao desmontar
          return () => {
            authListener?.subscription.unsubscribe();
          };
    }, []);

    // Função para buscar as transações (agora centralizada!)
    const fetchTransactions = useCallback(async (userId) => {
        if (!userId) {
            setTransactions([]); // Limpa as transações se não há usuário
            setLoading(false);
            return;
        }
        
        console.log("Contexto: Buscando transações..."); // Para debug
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
            .from('transacoes')
            .select('*')
            .eq('user_id', userId)
            // Podemos ordenar aqui se quisermos um padrão, ou deixar para as páginas
             .order('data', { ascending: false }); 

        if (error) {
            console.error('Erro no Contexto ao buscar transações:', error);
            setError(error.message);
            setTransactions([]); // Limpa em caso de erro
        } else {
            setTransactions(data);
        }
        setLoading(false);
    }, []); // useCallback para otimizar

    // Busca as transações QUANDO o usuário for definido (ou mudar)
    useEffect(() => {
        if (user) {
            fetchTransactions(user.id);
        } else {
             // Se o usuário fez logout, limpa os dados
            setTransactions([]);
            setLoading(false);
        }
    }, [user, fetchTransactions]);

    // 3. Define o "valor" que o Contexto vai fornecer
    const value = {
        transactions,           // A lista de transações
        loading,                // Booleano indicando se está carregando
        error,                  // Mensagem de erro (se houver)
        user,                   // Informação do usuário logado
        refetchTransactions: () => user ? fetchTransactions(user.id) : null // Função para recarregar
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
}

// 4. Cria um Hook customizado para facilitar o uso do Contexto
export function useTransactions() {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions deve ser usado dentro de um TransactionProvider');
    }
    return context;
}