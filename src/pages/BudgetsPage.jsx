
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BudgetModal from './BudgetModal';
import { Plus } from 'lucide-react';
import BudgetProgressCard from './BudgetProgressCard';
import toast from 'react-hot-toast';
import { useTransactions } from '../context/TransactionContext'; 

const formatMonth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [loadingBudgets, setLoadingBudgets] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const navigate = useNavigate();

    const {
        transactions,
        loading: loadingTransactions, 
        error: errorTransactions,
        user
    } = useTransactions();


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
            toast.error('Erro ao carregar orçamentos.');
        } else {
            setBudgets(data || []); 
        }
        setLoadingBudgets(false);
    };

    useEffect(() => {
        const checkUserAndFetch = () => {
             if (!user && !loadingTransactions) { 
                 navigate('/auth');
             } else if (user) {
                 fetchBudgets(user.id);
             }
         };

        const timer = setTimeout(checkUserAndFetch, 50);

        return () => clearTimeout(timer); 

    }, [user, loadingTransactions, navigate]);


    const handleBudgetSaved = () => {
        if(user) fetchBudgets(user.id); 
        setEditingBudget(null);
        setIsModalOpen(false);
    };

    const handleModalClose = () => {
        setEditingBudget(null);
        setIsModalOpen(false);
    };

    const handleEditClick = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

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
                fetchBudgets(user.id);
            }
        }
    };

    const isLoading = loadingBudgets || loadingTransactions;


     if (!user && loadingTransactions) { 
         return <div className="p-8 text-gray-400">Carregando dados...</div>;
     }
     if (!user && !loadingTransactions) { 
         return null; 
     }

    return (
        <div className="p-8">
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

            {isLoading && <p className="text-gray-400 text-center py-10">Carregando dados...</p>}
            
            {errorTransactions && <p className="text-red-400 text-center py-10">Erro ao carregar transações: {errorTransactions}</p>}

            {!isLoading && budgets.length === 0 && !errorTransactions && (
                <div className="text-center p-12 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white">Nenhum orçamento criado</h3>
                    <p className="text-gray-400 mt-2 mb-4">Clique em "Novo Orçamento" para começar.</p>
                </div>
            )}

            {!isLoading && budgets.length > 0 && !errorTransactions && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget) => (
                        <BudgetProgressCard
                            key={budget.id}
                            budget={budget}
                            transactions={transactions || []} 
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onBudgetSaved={handleBudgetSaved}
                user={user} 
                budgetToEdit={editingBudget}
            />
        </div>
    );
}

export default BudgetsPage;