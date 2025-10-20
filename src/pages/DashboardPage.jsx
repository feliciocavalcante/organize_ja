// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
// LogOut e logoTop não são mais necessários aqui
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';

import TransactionModal from '/src/pages/TransactionModal.jsx';
import CategoryPieChart from '../dashboardComponents/Charts/CategoryPieChart';


const MetricCard = ({ title, value, icon: Icon, color, isTotal = false, totalValue = 0 }) => {
    // ... (Sem alterações neste componente)
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
    // ... (Sem alterações neste componente)
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
                        <span className="space-x-4">
                            <button onClick={() => onEditClick(tx)} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                                Editar
                            </button>
                            <button
                                onClick={() => onDeleteClick(tx)}
                                className="text-red-500 hover:text-red-400 text-sm font-semibold"
                            >
                                Excluir
                            </button>
                        </span>
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
    // const [fullName, setFullName] = useState(''); // REMOVIDO
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async (userId) => { // Modificado para receber o ID
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
            .eq('user_id', userId) // Usa o ID recebido
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
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (transaction) => {
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
                // Recarrega as transações usando o ID do usuário que já temos
                fetchTransactions(user.id);
            }
        }
    };

    // Este useEffect agora SÓ verifica o usuário e o define no estado.
    // A lógica de buscar 'fullName' foi removida.
    useEffect(() => {
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

    // Este useEffect continua o mesmo, buscando transações QUANDO o usuário for definido
    useEffect(() => {
        if (user) {
            fetchTransactions(user.id);
        }
    }, [user]);


    // const handleLogout = async () => { ... }; // REMOVIDO

    const metrics = useMemo(() => {
        // ... (Sem alterações aqui)
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

        return {
            entradas: formatCurrency(entradas),
            saidas: formatCurrency(saidas),
            total: formatCurrency(total),
            total_num: total,
        };

    }, [transactions]);

    if (authLoading) {
        // O fundo da página agora é controlado pelo AppLayout
        return <div className="p-8 text-cyan-400">Verificando sessão...</div>;
    }

    if (!user) {
        return null; // O Header/AppLayout já deve ter redirecionado
    }

    // const firstName = fullName.split(' ')[0]; // REMOVIDO

    // O 'return' foi 100% substituído
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
                        <h2 className="text-2xl font-bold text-white border-b border-cyan-400 pb-2">
                            Minhas Transações
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-cyan-600 cursor-pointer hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
                        >
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
            transactionToEdit={editingTransaction}
        />

        </>
    );
};

export default DashboardPage;