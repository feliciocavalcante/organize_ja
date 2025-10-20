// src/pages/TransactionsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TransactionModal from '/src/pages/TransactionModal.jsx';


const TransactionTable = ({ transactions, loading, error, onEditClick, onDeleteClick }) => {
    // ... (Este componente está perfeito, sem alterações) ...
    if (loading) {
        return <div className="text-gray-400 text-center p-6">Carregando transações...</div>;
    }
    if (error) {
        return <div className="text-red-400 text-center p-6">Erro ao buscar transações: {error}</div>;
    }
    if (transactions.length === 0) {
        return <div className="text-gray-500 text-center p-6">Nenhuma transação encontrada para este filtro.</div>;
    }

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
// --- Fim: Cópia do TransactionTable ---


// --- Página Principal de Transações ---
function TransactionsPage() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // 1. Verificar usuário
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
            } else {
                setUser(user);
            }
        };
        fetchUser();
    }, [navigate]);

    // 2. Função para buscar transações (Sua lógica estava correta)
    const fetchTransactions = async (userId, texto, tipo) => {
        setLoading(true);
        setError(null);

        let query = supabase
            .from('transacoes')
            .select('*')
            .eq('user_id', userId)

        if (texto) {
            query = query.ilike('descricao', `%${texto}%`);
        }

        if (tipo) {
            query = query.eq('tipo', tipo);
        }
        
        query = query.order('data', { ascending: false }); // Ordem aplicada no final

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao buscar transações:', error);
            setError(error.message);
        } else {
            setTransactions(data);
        }
        setLoading(false);
    };

    // 3. Buscar transações (Sua lógica estava correta)
    useEffect(() => {
        if (user) {
            fetchTransactions(user.id, filtroTexto, filtroTipo);
        }
    }, [user, filtroTexto, filtroTipo]);

    // 4. Funções de Ação (Editar e Deletar)
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (transaction) => {
        if (window.confirm(`Tem certeza que deseja excluir: "${transaction.descricao}"?`)) {
            const { error } = await supabase
                .from('transacoes')
                .delete()
                .eq('id', transaction.id);

            if (error) {
                alert(`Erro ao deletar: ${error.message}`);
            } else {
                alert('Transação deletada!');
                // CORREÇÃO: Passar os filtros atuais ao recarregar
                fetchTransactions(user.id, filtroTexto, filtroTipo);
            }
        }
    };

    // 5. Função para recarregar quando o modal fechar
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        // CORREÇÃO: Passar os filtros atuais ao recarregar
        fetchTransactions(user.id, filtroTexto, filtroTipo);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">
                Minhas Transações
            </h1>

            {/* --- CORREÇÃO: JSX DOS FILTROS ADICIONADO --- */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Filtro por Texto */}
                    <div>
                        <label htmlFor="filtroTexto" className="block text-sm font-medium text-gray-300 mb-1">
                            Buscar por Título
                        </label>
                        <input
                            type="text"
                            id="filtroTexto"
                            value={filtroTexto}
                            onChange={(e) => setFiltroTexto(e.target.value)}
                            placeholder="Ex: Supermercado"
                            className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>

                    {/* Filtro por Tipo */}
                    <div>
                        <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-300 mb-1">
                            Filtrar por Tipo
                        </label>
                        <select
                            id="filtroTipo"
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="">Todos</option>
                            <option value="entrada">Entradas</option>
                            <option value="saida">Saídas</option>
                        </select>
                    </div>
                    
                </div>
            </div>

            {/* --- Tabela --- */}
            <TransactionTable
                transactions={transactions}
                loading={loading}
                error={error}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />

            {/* --- Modal --- */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onTransactionSaved={handleModalClose}
                transactionToEdit={editingTransaction}
            />

        </div>
    );
}

export default TransactionsPage;