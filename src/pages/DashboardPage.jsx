import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';

// IMPORTAÇÃO DO MODAL DE TRANSAÇÕES
import TransactionModal from '/src/pages/TransactionModal.jsx';

// IMPORTAÇÃO DO LOGO
import LOGO_URL from '/src/assets/logo1.png';

// --- Componentes Reutilizáveis ---

const MetricCard = ({ title, value, icon: Icon, color, isTotal = false, totalValue = 0 }) => {

    let bgColor = 'bg-white'; // Fundo padrão
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

// 📍 COMPONENTE TRANSACTIONTABLE CORRIGIDO
// (A função handleDeleteClick FOI REMOVIDA DAQUI)
const TransactionTable = ({ transactions, loading, error, onEditClick, onDeleteClick }) => {

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

            {/* Linhas da Tabela */}
            {transactions.map((tx) => (
                // 📍 Corrigido erro de digitação 'border-gray-8000'
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

                    {/* 📍 Botões com espaçamento */}
                    <div className="mt-2 md:mt-0 mr-2 md:text-right">
                        <span className="space-x-4"> {/* Adicionado para espaçamento */}
                            <button onClick={() => onEditClick(tx)} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                                Editar
                            </button>
                            <button
                                onClick={() => onDeleteClick(tx)} // Chama a função do pai
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
    const [fullName, setFullName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async () => {
        setTransactionsLoading(true);
        setTransactionsError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setTransactionsError('Usuário não logado');
            setTransactionsLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('transacoes')
            .select('*')
            .eq('user_id', user.id)
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

    // 📍 CORREÇÃO: A FUNÇÃO VEIO PARA CÁ (LUGAR CORRETO)
    const handleDeleteClick = async (transaction) => {

        // 1. Confirmação
        if (window.confirm(`Tem certeza que deseja excluir a transação: "${transaction.descricao}"?`)) {

            // 2. Tenta deletar no Supabase
            const { error } = await supabase
                .from('transacoes')
                .delete()
                .eq('id', transaction.id); // Deleta a linha ONDE o id bate

            if (error) {
                console.error('Erro ao deletar:', error);
                alert(`Erro ao deletar: ${error.message}`);
            } else {
                // 3. Sucesso!
                alert('Transação deletada com sucesso!');

                // 4. Recarrega a lista de transações (AGORA FUNCIONA)
                fetchTransactions(); 
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setAuthLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/auth');
                return;
            }

            setUser(user);
            setFullName(user.email);

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (!error && profile && profile.full_name) {
                setFullName(profile.full_name);
            }

            setAuthLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const metrics = useMemo(() => {
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
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-cyan-400 text-xl font-bold">Carregando Dashboard...</div>;
    }

    if (!user) {
        return null;
    }

    const firstName = fullName.split(' ')[0];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* HEADER FIXO */}
            <header className="bg-fuchsia-800 p-4 shadow-xl sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center max-w-7xl">
                    <div className="flex items-center space-x-3">
                        <img
                            src={LOGO_URL}
                            alt="Organize Já Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="hidden sm:inline text-white text-xl font-extrabold"> | Olá, {firstName}!</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm md:text-base"
                    >
                        Nova Transação
                    </button>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="container mx-auto p-4 md:p-16 max-w-7xl">
                {/* 1. CARDS DE MÉTRICAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transform md:-translate-y-12">
                    <MetricCard title="Entradas" value={metrics.entradas} icon={ArrowUp} color="text-green-500" />
                    <MetricCard title="Saídas" value={metrics.saidas} icon={ArrowDown} color="text-red-500" />
                    <MetricCard title="Total" value={metrics.total} icon={DollarSign} isTotal={true} totalValue={metrics.total_num} />
                </div>

                {/* 2. TABELA DE TRANSAÇÕES */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-cyan-400 pb-2">Minhas Transações</h2>
                    <TransactionTable
                        transactions={transactions}
                        loading={transactionsLoading}
                        error={transactionsError}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick} // Agora isso funciona
                    />
                </div>

                {/* Botão Sair */}
                <div className="mt-10 text-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center mx-auto bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition duration-300"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair da Conta
                    </button>
                </div>
            </main>

            {/* 3. MODAL DE TRANSAÇÃO */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
                onTransactionSaved={fetchTransactions}
                transactionToEdit={editingTransaction}
            />
        </div>
    );
};

export default DashboardPage;