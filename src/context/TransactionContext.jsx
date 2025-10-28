
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              setUser(session?.user ?? null);
            }
          );
      
          return () => {
            authListener?.subscription.unsubscribe();
          };
    }, []);

    const fetchTransactions = useCallback(async (userId) => {
        if (!userId) {
            setTransactions([]);
            setLoading(false);
            return;
        }
        
        console.log("Contexto: Buscando transações...");
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
            .from('transacoes')
            .select('*')
            .eq('user_id', userId)
             .order('data', { ascending: false }); 

        if (error) {
            console.error('Erro no Contexto ao buscar transações:', error);
            setError(error.message);
            setTransactions([]); 
        } else {
            setTransactions(data);
        }
        setLoading(false);
    }, []); 

    useEffect(() => {
        if (user) {
            fetchTransactions(user.id);
        } else {
           
            setTransactions([]);
            setLoading(false);
        }
    }, [user, fetchTransactions]);

    const value = {
        transactions,           
        loading,              
        error,                
        user,                  
        refetchTransactions: () => user ? fetchTransactions(user.id) : null 
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions deve ser usado dentro de um TransactionProvider');
    }
    return context;
}