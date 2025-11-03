// src/pages/TransactionsPage.jsx

import React, { useState, useEffect, useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import TransactionModal from '/src/pages/TransactionModal.jsx';
import toast from 'react-hot-toast';
import { useTransactions } from '../context/TransactionContext';


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


function TransactionsPage() {
    
    const navigate = useNavigate();

  
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

   
    const {
        transactions: allTransactions, 
        loading,
        error,
        user,
        refetchTransactions
    } = useTransactions();

   



    const filteredTransactions = useMemo(() => {
  
        if (!Array.isArray(allTransactions)) return [];

        return allTransactions.filter(tx => {
            const textoMatch = filtroTexto
                ? tx.descricao.toLowerCase().includes(filtroTexto.toLowerCase())
                : true; 

            const tipoMatch = filtroTipo
                ? tx.tipo === filtroTipo
                : true; 

            return textoMatch && tipoMatch;
        });
       
    }, [allTransactions, filtroTexto, filtroTipo]);


    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
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
                refetchTransactions(); 
            }
        }
    };


    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
       
    };



    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user && !loading) {
                navigate('/auth');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [user, loading, navigate]);


    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Minhas Transações</h1>

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
                loading={loading} 
                error={error}    
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />

            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onTransactionSaved={refetchTransactions} 
                transactionToEdit={editingTransaction}
            />
        </div>
    );
}

export default TransactionsPage;