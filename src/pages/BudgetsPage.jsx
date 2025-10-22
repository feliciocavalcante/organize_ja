// src/pages/BudgetsPage.jsx

import React, { useState, useEffect } from 'react'; // useEffect ainda necessário para budgets
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BudgetModal from './BudgetModal';
import { Plus } from 'lucide-react';
import BudgetProgressCard from './BudgetProgressCard';
import toast from 'react-hot-toast';
import { useTransactions } from '../context/TransactionContext'; // 1. IMPORTAR O HOOK

// ... (Função formatMonth - Sem alterações) ...
const formatMonth = (dateString) => { /* ... */ };

function BudgetsPage() {
    // States locais para Budgets e Modal (Continuam)
    const [budgets, setBudgets] = useState([]);
    const [loadingBudgets, setLoadingBudgets] = useState(true); // Renomeado para clareza
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const navigate = useNavigate();

    // REMOVIDO: State local para transactions
    // const [transactions, setTransactions] = useState([]);

    // 2. USAR O HOOK DO CONTEXTO para pegar as transações
    const {
        transactions,
        loading: loadingTransactions, // Renomeado para clareza
        error: errorTransactions,
        user, // Pega o usuário do contexto
        // refetchTransactions // Não precisamos recarregar transações aqui
    } = useTransactions();


    // 3. FUNÇÃO PARA BUSCAR APENAS OS ORÇAMENTOS
    const fetchBudgets = async (userId) => {
        if (!userId) return; // Segurança

        console.log("BudgetsPage: Buscando orçamentos..."); // Debug
        setLoadingBudgets(true);
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', userId)
            .order('month', { ascending: false });

        if (error) {
            console.error('Erro ao buscar orçamentos:', error);
            // Poderíamos usar toast.error aqui também
        } else {
            setBudgets(data);
        }
        setLoadingBudgets(false);
    };

    // REMOVIDO: Função fetchData que buscava tudo
    // const fetchData = async (userId) => { /* ... */ };

    // REMOVIDO: useEffect fetchUser (o contexto já fornece o user)
    // useEffect(() => { /* ... */ }, [navigate]);

    // 4. ATUALIZADO: useEffect busca budgets QUANDO o user do contexto for definido
    useEffect(() => {
        if (user) {
            fetchBudgets(user.id);
        } else if (!user && !loadingTransactions) { // Se o contexto não está carregando e não tem user
             // Adiciona um pequeno delay para garantir que o user do contexto foi carregado
            const timer = setTimeout(() => {
                // Re-verifica o user do contexto antes de redirecionar
                if (!user) {
                     navigate('/auth');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [user, loadingTransactions, navigate]); // Depende do user e loading do contexto


    // 5. ATUALIZADO: handleBudgetSaved chama fetchBudgets local
    const handleBudgetSaved = () => {
        fetchBudgets(user.id); // Recarrega APENAS os orçamentos
        setEditingBudget(null);
        setIsModalOpen(false);
    };

    // ... (handleModalClose - Sem alterações) ...
    const handleModalClose = () => {
        setEditingBudget(null);
        setIsModalOpen(false);
    };

    // ... (handleEditClick - Sem alterações) ...
    const handleEditClick = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    // 6. ATUALIZADO: handleDeleteClick chama fetchBudgets local
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
                fetchBudgets(user.id); // Recarrega APENAS os orçamentos
            }
        }
    };


    // Define um estado combinado de loading
    const isLoading = loadingBudgets || loadingTransactions;

    // ----- Renderização -----

    // Se o usuário ainda não carregou (do contexto), mostra loading inicial
    // Ou se o authLoading do DashboardPage não rodou ainda
     if (!user && loadingTransactions) {
         return <div className="p-8 text-gray-400">Carregando dados...</div>;
     }

     // Se explicitamente não há user após loading, já deve ter redirecionado, mas como fallback:
     if (!user && !loadingTransactions) {
         return null; // Ou um redirect <Navigate to="/auth" /> se usar react-router
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

            {/* --- Loading ou Lista Vazia --- */}
            {/* Usa o loading combinado */}
            {isLoading && <p className="text-gray-400">Carregando orçamentos...</p>}

            {/* Mostra erro das transações se houver */}
            {errorTransactions && <p className="text-red-400">Erro ao carregar transações: {errorTransactions}</p>}

            {!isLoading && budgets.length === 0 && (
                <div className="text-center p-12 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white">Nenhum orçamento criado</h3>
                    <p className="text-gray-400 mt-2 mb-4">Clique em "Novo Orçamento" para começar.</p>
                </div>
            )}

            {/* --- Lista de Orçamentos --- */}
            {/* Usa o loading combinado e passa transactions do contexto */}
            {!isLoading && budgets.length > 0 && (
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
                user={user} // Passa o user do contexto
                budgetToEdit={editingBudget}
            />
        </div>
    );
}

export default BudgetsPage;