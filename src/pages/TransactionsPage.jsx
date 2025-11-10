// src/pages/TransactionsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TransactionModal from '/src/pages/TransactionModal.jsx';
import toast from 'react-hot-toast';
// ADICIONADO: Importar X (para limpar o filtro)
import { X } from 'lucide-react';
// MODIFICADO: Trocamos 'transactions' por 'refetchTransactions' e 'user'
import { useTransactions } from '../context/TransactionContext';

// ... (Componente TransactionTable - Sem alterações) ...
const TransactionTable = ({ transactions, loading, error, onEditClick, onDeleteClick }) => {
    if (loading) return <div className="text-gray-400 text-center p-6">Carregando transações...</div>;
    if (error) return <div className="text-red-400 text-center p-6">Erro ao buscar transações: {error}</div>;
    if (!Array.isArray(transactions) || transactions.length === 0) return <div className="text-gray-500 text-center p-6">Nenhuma transação encontrada para este filtro.</div>;
    return (
        <div className="bg-gray-800 rounded-lg shadow-xl p-4 mt-6">
            <div className="hidden md:grid grid-cols-6 gap-4 text-gray-500 font-semibold border-b border-gray-700 pb-3 mb-3 ">
                <div className="col-span-2">Título</div>
                <div>Valor</div>
                <div>Categoria</div>
                <div>Data</div>
                <div className="md:text-right">Ações</div>
            </div>
            {transactions.map((tx) => (
                <div key={tx.id} className="border-b rounded-lg border-gray-800 mb-3 last:mb-0 py-3 last:border-b-0 hover:bg-gray-700 transition-colors md:grid md:grid-cols-6 md:gap-4 flex flex-col md:flex-row">
                    <div className="col-span-2 text-white ml-2 font-semibold">{tx.descricao}</div>
                    <div className={`font-bold ${tx.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.tipo === 'saida' ? '- ' : '+ '}
                        R$ {tx.valor.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-gray-400 text-sm md:text-base">{tx.categoria}</div>
                    <div className="text-gray-400 text-sm md:text-base">{new Date(tx.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    <div className="mt-2 md:mt-0 mr-2 md:text-right">
                        <span className="space-x-4">
                            <button onClick={() => onEditClick(tx)} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">Editar</button>
                            <button onClick={() => onDeleteClick(tx)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Excluir</button>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
// --- Fim do TransactionTable ---


// --- Página Principal de Transações (MODIFICADA) ---
function TransactionsPage() {
    const navigate = useNavigate();

    // MODIFICADO: Pegamos o 'user' e a função de 'refetch' do contexto
    const { user, refetchTransactions: refetchContextTransactions } = useTransactions();

    // MODIFICADO: States locais para esta página
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States dos Filtros (ADICIONADO filtroMes)
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroMes, setFiltroMes] = useState(''); // Estado para "YYYY-MM"

    // States do Modal (igual)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // MODIFICADO: Função local de busca com filtros (Server-side)
    const fetchTransactions = async () => {
        if (!user) return; // Espera o usuário do contexto carregar
        setLoading(true);
        setError(null);

        let query = supabase
            .from('transacoes')
            .select('*')
            .eq('user_id', user.id);

        // Aplicar filtros
        if (filtroTexto) {
            query = query.ilike('descricao', `%${filtroTexto}%`);
        }
        if (filtroTipo) {
            query = query.eq('tipo', filtroTipo);
        }
        // ADICIONADO: Filtro de Mês
        if (filtroMes) { // Ex: "2025-10"
            const startDate = `${filtroMes}-01`; // "2025-10-01"

            // Calcula o próximo mês
            const nextMonthDate = new Date(filtroMes + '-01T12:00:00Z'); // Adiciona T12:00:00Z para segurança com fuso
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            const endDate = nextMonthDate.toISOString().split('T')[0]; // "2025-11-01"

            query = query.gte('data', startDate); // Maior ou igual a 1º de Outubro
            query = query.lt('data', endDate);    // Menor que 1º de Novembro
        }

        query = query.order('data', { ascending: false }); // Sempre ordenar

        const { data, error } = await query;
        if (error) {
            setError(error.message);
            toast.error(error.message);
        } else {
            setTransactions(data);
        }
        setLoading(false);
    };

    // MODIFICADO: useEffect agora depende dos filtros
    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
        // Este hook RODA NOVAMENTE se o usuário ou qualquer filtro mudar
    }, [user, filtroTexto, filtroTipo, filtroMes]);


    // handleEditClick (igual)
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    // MODIFICADO: Funções de CUD (Create, Update, Delete)
    // Agora elas precisam recarregar os dados locais E os dados do contexto
    
    // Recarrega dados locais e do contexto
    const refreshAllData = () => {
        fetchTransactions(); // Recarrega os dados desta página
        refetchContextTransactions(); // Recarrega os dados do contexto (para o Dashboard)
    };

    const handleDeleteClick = async (transaction) => {
        if (!user) return;
        if (window.confirm(`Tem certeza que deseja excluir: "${transaction.descricao}"?`)) {
            const { error: deleteError } = await supabase
                .from('transacoes')
                .delete()
                .eq('id', transaction.id);

            if (deleteError) {
                toast.error(`Erro ao deletar: ${deleteError.message}`);
            } else {
                toast.success('Transação deletada!');
                refreshAllData(); // Recarrega tudo
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        refreshAllData(); // Recarrega tudo ao fechar o modal (caso algo tenha salvo)
    };

    // Verifica loading do user do contexto
    if (!user) {
         return <div className="p-8 text-gray-400 text-center">Carregando usuário...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Minhas Transações</h1>

            {/* --- ADICIONADO: Filtro de Mês --- */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Filtro por Texto */}
                    <div>
                        <label htmlFor="filtroTexto" className="block text-sm font-medium text-gray-300 mb-1">Buscar por Título</label>
                        <input type="text" id="filtroTexto" value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} placeholder="Ex: Supermercado" className="cursor-pointer py-2 px-3 w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/>
                    </div>

                    {/* Filtro por Tipo */}
                    <div>
                        <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-300 mb-1">Filtrar por Tipo</label>
                        <select id="filtroTipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className=" cursor-pointer py-2 px-3 w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
                            <option value="">Todos</option>
                            <option value="entrada">Entradas</option>
                            <option value="saida">Saídas</option>
                        </select>
                    </div>

                    {/* Filtro por Mês */}
                    <div>
                        <label htmlFor="filtroMes" className="block text-sm font-medium text-gray-300 mb-1">Filtrar por Mês</label>
                        <div className="flex">
                            <input
                                type="month"
                                id="filtroMes"
                                value={filtroMes}
                                onChange={(e) => setFiltroMes(e.target.value)}
                                className=" cursor-pointer py-2 px-3 w-full bg-gray-700 border-gray-600 rounded-l-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            {/* Botão Limpar Filtro de Mês */}
                            <button
                                onClick={() => setFiltroMes('')}
                                className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-r-md"
                                title="Limpar mês"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Tabela --- */}
            <TransactionTable
                transactions={transactions} // Usa o state local 'transactions'
                loading={loading} // Usa o state local 'loading'
                error={error}     // Usa o state local 'error'
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />

            {/* --- Modal --- */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onTransactionSaved={handleModalClose} // handleModalClose já recarrega tudo
                transactionToEdit={editingTransaction}
            />
        </div>
    );
}

export default TransactionsPage;