// src/pages/TransactionsPage.jsx

import React, { useState, useEffect, useMemo } from 'react'; // useMemo é importante aqui
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TransactionModal from '/src/pages/TransactionModal.jsx';
import toast from 'react-hot-toast';
import { useTransactions } from '../context/TransactionContext'; // 1. IMPORTAR O HOOK

// ... (Componente TransactionTable - Sem alterações) ...
const TransactionTable = ({ transactions, loading, error, onEditClick, onDeleteClick }) => {
    // Adiciona verificação se loading é true
    if (loading) return <div className="text-gray-400 text-center p-6">Carregando transações...</div>;
    if (error) return <div className="text-red-400 text-center p-6">Erro ao buscar transações: {error}</div>;
    // Garante que transactions é um array
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

// --- Página Principal de Transações ---
function TransactionsPage() {
    // REMOVIDO: States locais de user, transactions, loading, error
    // const [user, setUser] = useState(null);
    // const [transactions, setTransactions] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const navigate = useNavigate();

    // States dos Filtros (Continuam)
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    // States do Modal (Continuam)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // 2. USAR O HOOK DO CONTEXTO
    const {
        transactions: allTransactions, // Renomeado para não conflitar
        loading,
        error,
        user,
        refetchTransactions
    } = useTransactions();

    // REMOVIDO: useEffect fetchUser
    // useEffect(() => { /* ... */ }, [navigate]);

    // REMOVIDO: fetchTransactions local
    // const fetchTransactions = async (userId, texto, tipo) => { /* ... */ };

    // REMOVIDO: useEffect que chamava fetchTransactions local
    // useEffect(() => { /* ... */ }, [user, filtroTexto, filtroTipo]);


    // 3. FILTRAGEM CLIENT-SIDE com useMemo
    const filteredTransactions = useMemo(() => {
        // Se não houver transações do contexto, retorna array vazio
        if (!Array.isArray(allTransactions)) return [];

        return allTransactions.filter(tx => {
            const textoMatch = filtroTexto
                ? tx.descricao.toLowerCase().includes(filtroTexto.toLowerCase())
                : true; // Se filtroTexto for vazio, passa tudo

            const tipoMatch = filtroTipo
                ? tx.tipo === filtroTipo
                : true; // Se filtroTipo for vazio, passa tudo

            return textoMatch && tipoMatch;
        });
        // Recalcula APENAS se as transações do contexto ou os filtros mudarem
    }, [allTransactions, filtroTexto, filtroTipo]);


    // ... (handleEditClick - Sem alterações) ...
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    // 4. ATUALIZAR handleDeleteClick para usar refetch
    const handleDeleteClick = async (transaction) => {
        if (!user) return;
        if (window.confirm(`Tem certeza que deseja excluir: "${transaction.descricao}"?`)) {
            const { error: deleteError } = await supabase // Renomeado para evitar conflito com 'error' do contexto
                .from('transacoes')
                .delete()
                .eq('id', transaction.id);

            if (deleteError) {
                toast.error(`Erro ao deletar: ${deleteError.message}`);
            } else {
                toast.success('Transação deletada!');
                refetchTransactions(); // Chama a função do contexto
            }
        }
    };

    // 5. ATUALIZAR handleModalClose para usar refetch (embora o modal já use)
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        // Opcional: Chamar refetch aqui garante recarga mesmo se o modal falhar
        // refetchTransactions();
    };


    // ADICIONADO: useEffect para segurança (redirecionar se não houver user)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user && !loading) {
                navigate('/auth');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [user, loading, navigate]);


    // 6. JSX USA OS DADOS FILTRADOS E O ESTADO DO CONTEXTO
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Minhas Transações</h1>

            {/* --- Filtros (Sem alterações na estrutura) --- */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="filtroTexto" className="block text-sm font-medium text-gray-300 mb-1">Buscar por Título</label>
                        <input type="text" id="filtroTexto" value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} placeholder="Ex: Supermercado" className="px-4 py-2 w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-300 mb-1">Filtrar por Tipo</label>
                        <select id="filtroTipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className=" px-4 py-2 w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
                            <option value="">Todos</option>
                            <option value="entrada">Entradas</option>
                            <option value="saida">Saídas</option>
                        </select>
                    </div>
                </div>
            </div>

            <TransactionTable
                transactions={filteredTransactions}
                loading={loading} // Usa loading do contexto
                error={error}     // Usa error do contexto
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />

            {/* --- Modal --- */}
            {/* Modal agora chama refetchTransactions do contexto ao salvar */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onTransactionSaved={refetchTransactions} // Chama refetch do contexto
                transactionToEdit={editingTransaction}
            />
        </div>
    );
}

export default TransactionsPage;