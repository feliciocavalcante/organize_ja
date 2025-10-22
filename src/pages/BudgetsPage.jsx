// src/pages/BudgetsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BudgetModal from './BudgetModal';
import { Plus } from 'lucide-react';
import BudgetProgressCard from './BudgetProgressCard';
import toast from 'react-hot-toast';

const formatMonth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

function BudgetsPage() {
    const [user, setUser] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [editingBudget, setEditingBudget] = useState(null); 

    const fetchData = async (userId) => {
        setLoading(true);
        const [budgetsPromise, transactionsPromise] = await Promise.all([
            supabase.from('budgets').select('*').eq('user_id', userId).order('month', { ascending: false }),
            supabase.from('transacoes').select('*').eq('user_id', userId)
        ]);
        if (budgetsPromise.error) console.error('Erro orçamentos:', budgetsPromise.error);
        else setBudgets(budgetsPromise.data);
        if (transactionsPromise.error) console.error('Erro transações:', transactionsPromise.error);
        else setTransactions(transactionsPromise.data);
        setLoading(false);
    };

    // Busca o usuário
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/auth');
            else setUser(user);
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        if (user) fetchData(user.id);
    }, [user]);

    const handleBudgetSaved = () => {
        fetchData(user.id);
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
        if (window.confirm(`Tem certeza que deseja excluir o orçamento para "${budget.category}" em ${formatMonth(budget.month)}?`)) {
            const { error } = await supabase
                .from('budgets')
                .delete()
                .eq('id', budget.id)
                .eq('user_id', user.id);

            if (error) {
                toast.error(`Erro ao excluir: ${error.message}`);
                console.error(error);
            } else {
                toast.success('Orçamento excluído com sucesso!');
                fetchData(user.id); 
            }
        }
    };

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

            {loading && <p className="text-gray-400">Carregando orçamentos...</p>}
            {!loading && budgets.length === 0 && (
                <div className="text-center p-12 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white">Nenhum orçamento criado</h3>
                    <p className="text-gray-400 mt-2 mb-4">Clique em "Novo Orçamento" para começar.</p>
                </div>
            )}

            {!loading && budgets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget) => (
                        <BudgetProgressCard
                            key={budget.id}
                            budget={budget}
                            transactions={transactions}
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