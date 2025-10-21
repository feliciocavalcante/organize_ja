// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import TransactionModal from '/src/pages/TransactionModal.jsx';
// CORREÇÃO: Ajustei os caminhos que você usou
import CategoryPieChart from '../dashboardComponents/Charts/CategoryPieChart';
import UpgradeModal from '../planoModal/UpgradeModal.jsx';

const MetricCard = ({ title, value, icon: Icon, color, isTotal = false, totalValue = 0 }) => {
    // ... (Componente MetricCard está OK) ...
    let bgColor = 'bg-white';
    if (isTotal) {
        bgColor = totalValue >= 0 ? 'bg-green-600' : 'bg-red-600';
    }
    const isDarkBg = bgColor !== 'bg-white';

    return (
        <div className={`p-6 rounded-lg shadow-lg ${bgColor}`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-sm font-medium ${isDarkBg ? 'text-white' : 'text-gray-500'}`}>{title}</h3>
                {Icon && <Icon className={`w-6 h-6 ${isDarkBg ? 'text-white' : color}`} />}
            </div>
            <p className={`text-3xl font-extrabold ${isDarkBg ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </p>
        </div>
    );
};


const TransactionTable = ({ transactions, loading, error, onEditClick, onDeleteClick }) => {
    // ... (Componente TransactionTable está OK) ...
    if (loading) {
        return <div className="text-gray-400 text-center p-6">Carregando transações...</div>;
    }
    if (error) {
        return <div className="text-red-400 text-center p-6">Erro ao buscar transações: {error}</div>;
    }
    if (transactions.length === 0) {
        return <div className="text-gray-500 text-center p-6">Nenhuma transação encontrada.</div>;
    }

    return (
        <div className="bg-gray-900 rounded-lg shadow-xl p-4">
            <div className="hidden md:grid grid-cols-6 gap-4 text-gray-500 font-semibold border-b border-gray-700 pb-3 mb-3 ">
                <div className="col-span-2">Título</div>
                <div>Valor</div>
                <div>Categoria</div>
                <div>Data</div>
                <div className="md:text-right">Ações</div>
            </div>
            {transactions.map((tx) => (
                <div key={tx.id} className="border-b rounded-lg border-gray-800 mb-3 last:mb-0 py-3 last:border-b-0 hover:bg-gray-800 transition-colors md:grid md:grid-cols-6 md:gap-4 flex flex-col md:flex-row">
                    <div className="col-span-2 text-white ml-2 font-semibold">{tx.descricao}</div>
                    <div className={`font-bold ${tx.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.tipo === 'saida' ? '- ' : '+ '}
                        R$ {tx.valor.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-gray-400 text-sm md:text-base">{tx.categoria}</div>
                    <div className="text-gray-400 text-sm md:text-base">
                        {new Date(tx.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </div>
                    <div className="mt-2 md:mt-0 mr-2 md:text-right">
                        <div className="inline-flex flex-col space-y-2">
                            <button
                                onClick={() => onEditClick(tx)}
                                className="text-cyan-400 cursor-pointer hover:text-cyan-300 text-sm font-semibold">
                                Editar
                            </button>
                            <button
                                onClick={() => onDeleteClick(tx)}
                                className="text-red-500 hover:text-red-400 cursor-pointer text-sm font-semibold">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- Dashboard Principal ---
const DashboardPage = () => {
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async (userId) => {
        // ... (Função OK) ...
        setTransactionsLoading(true);
        setTransactionsError(null);
        if (!userId) {
            setTransactionsError('Usuário não logado');
            setTransactionsLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('transacoes')
            .select('*')
            .eq('user_id', userId)
            .order('data', { ascending: false });
        if (error) {
            console.error('Erro ao buscar transações:', error);
            setTransactionsError(error.message);
        } else {
            setTransactions(data);
        }
        setTransactionsLoading(false);
    };

    const handleEditClick = (transaction) => {
        // ... (Função OK) ...
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (transaction) => {
        // ... (Função OK) ...
        if (window.confirm(`Tem certeza que deseja excluir a transação: "${transaction.descricao}"?`)) {
            const { error } = await supabase
                .from('transacoes')
                .delete()
                .eq('id', transaction.id);
            if (error) {
                console.error('Erro ao deletar:', error);
                alert(`Erro ao deletar: ${error.message}`);
            } else {
                alert('Transação deletada com sucesso!');
                fetchTransactions(user.id);
            }
        }
    };

    useEffect(() => {
        // ... (useEffect de fetchUserData OK) ...
        const fetchUserData = async () => {
            setAuthLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }
            setUser(user);
            setAuthLoading(false);
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        // ... (useEffect de fetchTransactions OK) ...
        if (user) {
            fetchTransactions(user.id);
        }
    }, [user]);


    // CORREÇÃO: As funções foram MOVIDAS para o corpo do componente (aqui é o lugar certo)
    // E a lógica do '.single()' foi SUBSTITUÍDA para não quebrar.
    const handleOpenNewTransaction = async () => {
        if (!user) return;

        // 1. Busca o perfil (sem .single() para não quebrar)
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('plan_type')
            .eq('id', user.id);

        // 2. Define um plano padrão 'free' se o perfil não existir
        let profile = { plan_type: 'free' };
        if (!profileError && profiles && profiles.length > 0) {
            profile = profiles[0]; // Perfil real encontrado
        }

        // 3. Se o plano NÃO for 'free' (ex: 'pro'), libera direto!
        if (profile.plan_type !== 'free') {
            setEditingTransaction(null);
            setIsModalOpen(true);
            return;
        }

        // 4. Se for 'free', contamos as transações
        const { count, error: countError } = await supabase
            .from('transacoes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // 5. A Regra de Negóci
        const LIMITE_GRATIS = 5;
        if (count >= LIMITE_GRATIS) {
            // BLOQUEADO!
            setIsUpgradeModalOpen(true);
        } else {
            // LIBERADO!
            setEditingTransaction(null);
            setIsModalOpen(true);
        }
    };

   
    const handleUpgradePlan = () => {
        setIsUpgradeModalOpen(false); 
        navigate('/dashboard/checkout'); 
    };


    const metrics = useMemo(() => {
        // ... (Lógica de entradas, saidas, total, formatCurrency... OK) ...
        const entradas = transactions
            .filter(tx => tx.tipo === 'entrada')
            .reduce((acc, tx) => acc + tx.valor, 0);

        const saidas = transactions
            .filter(tx => tx.tipo === 'saida')
            .reduce((acc, tx) => acc + tx.valor, 0);

        const total = entradas - saidas;

        const formatCurrency = (value) => {
            return value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
        };

        // CORREÇÃO: O 'useMemo' PRECISA retornar o objeto dos metrics.
        // As funções de 'handle...' foram removidas daqui.
        return {
            entradas: formatCurrency(entradas),
            saidas: formatCurrency(saidas),
            total: formatCurrency(total),
            total_num: total,
        };

    }, [transactions]);

    if (authLoading) {
        return <div className="p-8 text-cyan-400">Verificando sessão...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        // O seu JSX estava correto
        <>
            <main className="container mx-auto p-4 md:p-16 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transform md:-translate-y-12">
                    <MetricCard title="Entradas" value={metrics.entradas} icon={ArrowUp} color="text-green-500" />
                    <MetricCard title="Saídas" value={metrics.saidas} icon={ArrowDown} color="text-red-500" />
                    <MetricCard title="Total" value={metrics.total} icon={DollarSign} isTotal={true} totalValue={metrics.total_num} />
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white border-b border-cyan-400 pb-2">
                                Minhas Transações
                            </h2>
                            <button
                                onClick={handleOpenNewTransaction} // Corrigido para chamar a função de verificação
                                className="bg-cyan-600 cursor-pointer hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
                                Nova Transação
                            </button>
                        </div>
                        <TransactionTable
                            transactions={transactions}
                            loading={transactionsLoading}
                            error={transactionsError}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <CategoryPieChart transactions={transactions} />
                    </div>
                </div>
            </main>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
                onTransactionSaved={() => fetchTransactions(user.id)}
                transactionToEdit={editingTransaction} />

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={handleUpgradePlan} />
        </>
    );
};

export default DashboardPage;