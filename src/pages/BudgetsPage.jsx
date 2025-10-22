// src/pages/BudgetsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BudgetModal from './BudgetModal';
import { Plus } from 'lucide-react';
import BudgetProgressCard from './BudgetProgressCard';
import toast from 'react-hot-toast';
import { useTransactions } from '../context/TransactionContext'; // Continua usando o hook

// ... (Função formatMonth - Sem alterações) ...
const formatMonth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

function BudgetsPage() {
    // States locais apenas para Budgets e Modal
    const [budgets, setBudgets] = useState([]);
    const [loadingBudgets, setLoadingBudgets] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const navigate = useNavigate();

    // PEGAR DADOS DO CONTEXTO (usuário, transações, loading das transações)
    const {
        transactions,
        loading: loadingTransactions, // Renomeado
        error: errorTransactions,
        user
        // Não precisamos do refetchTransactions aqui
    } = useTransactions();


    // FUNÇÃO SIMPLIFICADA: Busca apenas os orçamentos
    const fetchBudgets = async (userId) => {
        if (!userId) return;

        console.log("BudgetsPage: Buscando orçamentos...");
        setLoadingBudgets(true);
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', userId)
            .order('month', { ascending: false });

        if (error) {
            console.error('Erro ao buscar orçamentos:', error);
            toast.error('Erro ao carregar orçamentos.'); // Adiciona toast de erro
        } else {
            setBudgets(data || []); // Garante que é um array
        }
        setLoadingBudgets(false);
    };

    // useEffect para segurança e busca inicial de budgets
    useEffect(() => {
        // A lógica de segurança (redirecionar se não houver user)
        const checkUserAndFetch = () => {
             if (!user && !loadingTransactions) { // Se contexto carregou e não tem user
                 navigate('/auth');
             } else if (user) {
                 // Se tem usuário, busca os orçamentos (APENAS orçamentos)
                 fetchBudgets(user.id);
             }
         };

        // Roda a verificação após um pequeno delay para garantir que o contexto carregou
        const timer = setTimeout(checkUserAndFetch, 50);

        return () => clearTimeout(timer); // Limpa o timer

    }, [user, loadingTransactions, navigate]); // Depende do user e loading do contexto


    // handleBudgetSaved chama APENAS fetchBudgets
    const handleBudgetSaved = () => {
        if(user) fetchBudgets(user.id); // Recarrega orçamentos
        setEditingBudget(null);
        setIsModalOpen(false);
    };

    // handleModalClose (igual)
    const handleModalClose = () => {
        setEditingBudget(null);
        setIsModalOpen(false);
    };

    // handleEditClick (igual)
    const handleEditClick = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    // handleDeleteClick chama APENAS fetchBudgets
    const handleDeleteClick = async (budget) => {
        if (!user) return;
        if (window.confirm(`Tem certeza que deseja excluir o orçamento para "${budget.category}" em ${formatMonth(budget.month)}?`)) {
            const { error } = await supabase
                .from('budgets')
                .delete()
                .eq('id', budget.id)
                .eq('user_id', user.id);

            if (error) {
                toast.error(`Erro ao excluir: ${error.message}`);
            } else {
                toast.success('Orçamento excluído com sucesso!');
                fetchBudgets(user.id); // Recarrega orçamentos
            }
        }
    };

    // Loading combinado (loading dos budgets + loading das transações do contexto)
    const isLoading = loadingBudgets || loadingTransactions;

    // ----- Renderização -----

     if (!user && loadingTransactions) { // Se contexto ainda está buscando user
         return <div className="p-8 text-gray-400">Carregando dados...</div>;
     }
     if (!user && !loadingTransactions) { // Se contexto terminou e não achou user
         return null; // ou <Navigate to="/auth" />
     }

    return (
        <div className="p-8">
            {/* --- Cabeçalho --- */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Meus Orçamentos</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-lime-500 hover:bg-lime-400 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Orçamento
                </button>
            </div>

            {/* --- Loading / Erro / Lista Vazia --- */}
            {isLoading && <p className="text-gray-400 text-center py-10">Carregando dados...</p>}
            
            {/* Mostra erro das transações (vindo do contexto) se houver */}
            {errorTransactions && <p className="text-red-400 text-center py-10">Erro ao carregar transações: {errorTransactions}</p>}

            {!isLoading && budgets.length === 0 && !errorTransactions && (
                <div className="text-center p-12 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white">Nenhum orçamento criado</h3>
                    <p className="text-gray-400 mt-2 mb-4">Clique em "Novo Orçamento" para começar.</p>
                </div>
            )}

            {/* --- Lista de Orçamentos --- */}
            {/* Usa isLoading e passa transactions do contexto */}
            {!isLoading && budgets.length > 0 && !errorTransactions && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget) => (
                        <BudgetProgressCard
                            key={budget.id}
                            budget={budget}
                            transactions={transactions || []} // Passa transactions do contexto
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* --- O Modal --- */}
            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onBudgetSaved={handleBudgetSaved}
                user={user} // Passa user do contexto
                budgetToEdit={editingBudget}
            />
        </div>
    );
}

export default BudgetsPage;