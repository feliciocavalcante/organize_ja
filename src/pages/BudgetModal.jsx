// src/pages/BudgetModal.jsx

// CORREÇÃO 1: Unificar imports e adicionar useEffect
import React, { useState, useEffect } from 'react'; 
import { supabase } from '../supabaseClient';
import { X, Calendar, DollarSign, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

// Pega o mês atual no formato "YYYY-MM" (ex: "2025-10")
const getDefaultMonth = () => {
  return new Date().toISOString().slice(0, 7);
};

function BudgetModal({ isOpen, onClose, onBudgetSaved, user, budgetToEdit }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(getDefaultMonth());
  const [loading, setLoading] = useState(false);

  // Preenche o form se estiver editando
  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category);
      setAmount(budgetToEdit.amount.toString()); 
      setMonth(budgetToEdit.month.slice(0, 7)); 
    } else {
      setCategory('');
      setAmount('');
      setMonth(getDefaultMonth());
    }
  }, [budgetToEdit, isOpen]); // Roda quando o modal abre ou o orçamento para editar muda

  if (!isOpen) return null;

  // CORREÇÃO 2: Atualizar handleSubmit para lidar com UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount || !month || !user) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    const budgetData = {
      // user_id não é necessário aqui para update, mas necessário para insert
      category: category,
      amount: parseFloat(amount),
      month: `${month}-01`
    };

    let error = null; // Variável para guardar o erro

    if (budgetToEdit) {
        // --- LÓGICA DE UPDATE ---
        const { error: updateError } = await supabase
            .from('budgets')
            .update(budgetData)
            .eq('id', budgetToEdit.id)
            .eq('user_id', user.id); // Garante que só o dono pode editar
        error = updateError;
    } else {
        // --- LÓGICA DE INSERT ---
        budgetData.user_id = user.id; // Adiciona user_id para o INSERT
        const { error: insertError } = await supabase.from('budgets').insert(budgetData);
        error = insertError;
    }

    // Verifica se houve erro em qualquer uma das operações
    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      // Mensagem dinâmica
      toast.success(`Orçamento ${budgetToEdit ? 'atualizado' : 'criado'} com sucesso!`);
      onBudgetSaved(); // Avisa a página principal para recarregar
      handleClose();
    }
    setLoading(false);
  };

  const handleClose = () => {
    // Não precisamos resetar aqui, o useEffect já cuida disso
    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60" onClick={handleClose}>
      {/* Modal */}
      <div 
        className="relative z-50 w-full max-w-lg p-6 mx-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        
        {/* CORREÇÃO 3: Título dinâmico */}
        <h2 className="text-2xl font-bold text-white mb-6">
          {budgetToEdit ? 'Salvar Alterações' : 'Salvar Orçamento'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
              <div className="relative">
                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Alimentação, Transporte..."
                  required
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white pl-10 pr-4 py-2.5 focus:ring-lime-500 focus:border-lime-500"
                />
              </div>
            </div>

            {/* Valor */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Valor do Orçamento</label>
              <div className="relative">
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 500.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white pl-10 pr-4 py-2.5 focus:ring-lime-500 focus:border-lime-500"
                />
              </div>
            </div>

            {/* Mês */}
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-300 mb-1">Mês do Orçamento</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="month"
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white pl-10 pr-4 py-2.5 focus:ring-lime-500 focus:border-lime-500"
                />
              </div>
            </div>

            {/* Botão Salvar */}
            {/* CORREÇÃO 4: Texto do botão dinâmico */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-500 hover:bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (budgetToEdit ? 'Salvar Alterações' : 'Salvar Orçamento')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;