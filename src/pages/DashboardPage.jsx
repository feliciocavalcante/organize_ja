// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import TransactionModal from '/src/pages/TransactionModal.jsx';
import CategoryPieChart from '../dashboardComponents/Charts/CategoryPieChart';
import UpgradeModal from '../planoModal/UpgradeModal.jsx';
import toast from 'react-hot-toast';
import { useTransactions } from '../context/TransactionContext'; // 1. IMPORTAR O HOOK DO CONTEXTO

// ... (Componente MetricCard - Sem alterações) ...
const MetricCard = ({ title, value, icon: Icon, color, isTotal = false, totalValue = 0 }) => {
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
            <p className={`text-3xl font-extrabold ${isDarkBg ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
    );
};
// ... (Componente TransactionTable - Sem alterações) ...
const TransactionTable = ({ transactions, loading, error, onEditClick, onDeleteClick }) => {
    if (loading) return <div className="text-gray-400 text-center p-6">Carregando transações...</div>;
    if (error) return <div className="text-red-400 text-center p-6">Erro ao buscar transações: {error}</div>;
    // Garante que transactions é um array antes de verificar length
    if (!Array.isArray(transactions) || transactions.length === 0) return <div className="text-gray-500 text-center p-6">Nenhuma transação encontrada.</div>;
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
                    <div className="text-gray-400 text-sm md:text-base">{new Date(tx.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    <div className="mt-2 md:mt-0 mr-2 md:text-right">
                        <div className="inline-flex flex-col space-y-2">
                            <button onClick={() => onEditClick(tx)} className="text-cyan-400 cursor-pointer hover:text-cyan-300 text-sm font-semibold">Editar</button>
                            <button onClick={() => onDeleteClick(tx)} className="text-red-500 hover:text-red-400 cursor-pointer text-sm font-semibold">Excluir</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Dashboard Principal ---
const DashboardPage = () => {
    // --- States de Autenticação e Modais (Continuam) ---
    const [authLoading, setAuthLoading] = useState(true);
    // const [user, setUser] = useState(null); // REMOVIDO
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const navigate = useNavigate();
    const [editingTransaction, setEditingTransaction] = useState(null);

    // 2. USAR O HOOK DO CONTEXTO
    const {
        transactions,
        loading: transactionsLoading, // Renomeado
        error: transactionsError,
        user,
        refetchTransactions
    } = useTransactions();

    // REMOVIDO: fetchTransactions local
    // const fetchTransactions = async (userId) => { /* ... */ };

    // ... (handleEditClick - Sem alterações) ...
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    // 3. ATUALIZAR handleDeleteClick para usar refetch
    const handleDeleteClick = async (transaction) => {
        if (!user) return;
        if (window.confirm(`Tem certeza que deseja excluir a transação: "${transaction.descricao}"?`)) {
            const { error } = await supabase
                .from('transacoes')
                .delete()
                .eq('id', transaction.id);

            if (error) {
                toast.error(`Erro ao deletar: ${error.message}`);
            } else {
                toast.success('Transação deletada com sucesso!');
                refetchTransactions(); // Chama a função do contexto
            }
        }
    };

    // useEffect de Autenticação - Simplificado
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser && !user) { // Verifica user do contexto tb
                navigate('/auth');
            }
            setAuthLoading(false);
        };
        // Pequeno delay para garantir que o contexto teve tempo de carregar o user
        const timer = setTimeout(checkUser, 50);
        return () => clearTimeout(timer);
    }, [navigate, user]); // Depende do user do contexto também

    // REMOVIDO: useEffect que chamava fetchTransactions localmente
    // useEffect(() => { /* ... */ }, [user]);


    // handleOpenNewTransaction - Atualizada para usar 'user' do contexto
    const handleOpenNewTransaction = async () => {
        if (!user) return;

        const { data: profiles, error: profileError } = await supabase.from('profiles').select('plan_type').eq('id', user.id);
        let profile = { plan_type: 'free' };
        if (!profileError && profiles && profiles.length > 0) profile = profiles[0];

        if (profile.plan_type !== 'free') {
            setEditingTransaction(null);
            setIsModalOpen(true);
            return;
        }

        // Usa transactions.length do contexto se disponível
        const currentCount = Array.isArray(transactions) ? transactions.length : 0;
        const LIMITE_GRATIS = 3;

        if (currentCount >= LIMITE_GRATIS) {
            // Contagem precisa para ter certeza (pode haver atraso no contexto)
            const { count, error: countError } = await supabase
                .from('transacoes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (count >= LIMITE_GRATIS) {
                setIsUpgradeModalOpen(true);
            } else {
                setEditingTransaction(null);
                setIsModalOpen(true);
            }

        } else {
            setEditingTransaction(null);
            setIsModalOpen(true);
        }
    };

    // handleUpgradePlan - Atualizada para usar 'user' do contexto
    const handleUpgradePlan = () => {
        if (!user) return; // Ainda checa o usuário
        setIsUpgradeModalOpen(false); // Fecha o modal de alerta
        navigate('/dashboard/checkout'); // Redireciona para a página de checkout
    };

    // useMemo - Usa 'transactions' do contexto
    const metrics = useMemo(() => {
        // Adiciona checagem se transactions é array
        if (!Array.isArray(transactions)) return { entradas: 'R$ 0,00', saidas: 'R$ 0,00', total: 'R$ 0,00', total_num: 0 };

        const entradas = transactions.filter(tx => tx.tipo === 'entrada').reduce((acc, tx) => acc + tx.valor, 0);
        const saidas = transactions.filter(tx => tx.tipo === 'saida').reduce((acc, tx) => acc + tx.valor, 0);
        const total = entradas - saidas;
        const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return {
            entradas: formatCurrency(entradas),
            saidas: formatCurrency(saidas),
            total: formatCurrency(total),
            total_num: total,
        };
    }, [transactions]); // Depende das transações do contexto

    // ---- Renderização ----

    if (authLoading) {
        return <div className="p-8 text-cyan-400">Verificando sessão...</div>;
    }
    // Se o user do contexto ainda não carregou, espera (ou mostra loading)
    if (!user) {
        // Poderia retornar um spinner aqui
        return <div className="p-8 text-gray-400">Carregando dados do usuário...</div>;
    }

    // 4. JSX USA DADOS DO CONTEXTO
    return (
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
                            <h2 className="text-2xl font-bold text-white border-b border-cyan-400 pb-2">Minhas Transações</h2>
                            <button onClick={handleOpenNewTransaction} className="bg-cyan-600 cursor-pointer hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">Nova Transação</button>
                        </div>
                        <TransactionTable
                            transactions={transactions || []} // Usa transactions do contexto
                            loading={transactionsLoading} // Usa loading do contexto
                            error={transactionsError} // Usa error do contexto
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <CategoryPieChart transactions={transactions || []} /> {/* Usa transactions do contexto */}
                    </div>
                </div>
            </main>
            {/* 5. MODAL CHAMA REFETCH DO CONTEXTO */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
                onTransactionSaved={refetchTransactions} // Chama refetch do contexto
                transactionToEdit={editingTransaction} />
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={handleUpgradePlan} />
        </>
    );
};

export default DashboardPage;