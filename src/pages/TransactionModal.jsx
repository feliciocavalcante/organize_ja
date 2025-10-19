import React, { useState, useEffect, useCallback } from 'react';
import { X, DollarSign, Tag, Calendar, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Importa o cliente Supabase

// Opções de Categorias para o Select
const CATEGORY_OPTIONS = [
    'Salário', 'Investimento', 'Outras Receitas',
    'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Contas', 'Outras Despesas'
];

const TransactionModal = ({ isOpen, onClose, onTransactionSaved, transactionToEdit }) => {
    // 1. Estados do Formulário
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('entrada'); // 'entrada' ou 'saida'
    const [categoria, setCategoria] = useState(CATEGORY_OPTIONS[0]);
    const [data, setData] = useState(new Date().toISOString().split('T')[0]); // Data de hoje
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditMode = Boolean(transactionToEdit);

    useEffect(() => {
        if (isOpen) { // Só roda quando o modal abre
            if (isEditMode) {
                // Modo Edição: Preenche o formulário
                setDescricao(transactionToEdit.descricao);
                setValor(transactionToEdit.valor.toString()); // Valor precisa ser string para o input
                setTipo(transactionToEdit.tipo);
                setCategoria(transactionToEdit.categoria);
                setData(transactionToEdit.data); // O input 'date' aceita o formato 'YYYY-MM-DD'
            } else {
                // Modo Criação: Limpa o formulário (define padrões)
                setDescricao('');
                setValor('');
                setTipo('entrada');
                setCategoria(CATEGORY_OPTIONS[0]);
                setData(new Date().toISOString().split('T')[0]);
                setError(null);
            }
        }
    }, [isOpen, isEditMode, transactionToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // ... (A validação do usuário e do valor continua igual)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setError('Você precisa estar logado.');
            setLoading(false);
            return;
        }

        const valorNumerico = parseFloat(valor.replace(',', '.'));
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setError('Por favor, insira um valor válido e positivo.');
            setLoading(false);
            return;
        }

        // 1. Monta o objeto da transação
        const transactionData = {
            user_id: user.id,
            descricao: descricao,
            valor: valorNumerico,
            tipo: tipo,
            categoria: categoria,
            data: data,
        };

        // 📍 INÍCIO DA LÓGICA DE UPDATE / INSERT
        let error = null;

        if (isEditMode) {
            // MODO EDIÇÃO: Faz um UPDATE
            const { error: updateError } = await supabase
                .from('transacoes')
                .update(transactionData) // O objeto com os novos dados
                .eq('id', transactionToEdit.id); // Onde o ID bate
            error = updateError;

        } else {
            // MODO CRIAÇÃO: Faz um INSERT
            const { error: insertError } = await supabase
                .from('transacoes')
                .insert([transactionData]); // Envia o objeto
            error = insertError;
        }
        // 📍 FIM DA LÓGICA

        if (error) {
            console.error('Erro ao salvar transação:', error);
            setError(`Erro ao salvar: ${error.message}`);
        } else {
            // Sucesso!
            alert(isEditMode ? 'Transação atualizada!' : 'Transação salva!');

            // (Não precisamos mais limpar o form aqui, o 'useEffect' já faz isso)

            onTransactionSaved(); // Recarrega os dados no Dashboard
            onClose(); // Fecha o modal
        }

        setLoading(false);
    };

    // Estilos Tailwind para o botão de tipo (Entrada/Saída)
    const activeClass = 'ring-2 ring-cyan-500 bg-cyan-700 text-white';
    const inactiveClass = 'bg-gray-800 text-gray-400 hover:bg-gray-700';

    return (
        // Overlay do Modal
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">

            {/* Conteúdo do Modal */}
            <div className="bg-gray-900 w-full max-w-md p-6 rounded-xl shadow-2xl border border-gray-800 relative">

                {/* Cabeçalho do Modal (VOCÊ FEZ CERTO) */}
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-3">
                    {isEditMode ? 'Editar Transação' : 'Nova Transação'}
                </h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>


                {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Botões de Tipo (Entrada / Saída) */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setTipo('entrada')}
                            className={`flex items-center justify-center w-1/2 py-3 rounded-lg font-semibold transition-all ${tipo === 'entrada' ? activeClass : inactiveClass
                                }`}
                        >
                            <ArrowUp className="w-5 h-5 mr-2 text-green-400" />
                            Entrada
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipo('saida')}
                            className={`flex items-center justify-center w-1/2 py-3 rounded-lg font-semibold transition-all ${tipo === 'saida' ? activeClass : inactiveClass
                                }`}
                        >
                            <ArrowDown className="w-5 h-5 mr-2 text-red-400" />
                            Saída
                        </button>
                    </div>

                    {/* Campo Valor */}
                    <div>
                        <label className="text-gray-400 text-sm flex items-center mb-1">
                            <DollarSign className="w-4 h-4 mr-2" /> Valor
                        </label>
                        <input
                            type="number"
                            step="0.01" // Permite duas casas decimais
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Ex: 150.50"
                        />
                    </div>

                    {/* Campo Descrição */}
                    <div>
                        <label className="text-gray-400 text-sm flex items-center mb-1">
                            Descrição
                        </label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Ex: Salário, Aluguel, Supermercado"
                        />
                    </div>

                    {/* Categoria e Data (Lado a Lado) */}
                    <div className="flex space-x-4">
                        {/* Campo Categoria */}
                        <div className="w-1/2">
                            <label className="text-gray-400 text-sm flex items-center mb-1">
                                <Tag className="w-4 h-4 mr-2" /> Categoria
                            </label>
                            <div className="relative">
                                <select
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg appearance-none pr-10 focus:ring-cyan-500 focus:border-cyan-500"
                                >
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Campo Data */}
                        <div className="w-1/2">
                            <label className="text-gray-400 text-sm flex items-center mb-1">
                                <Calendar className="w-4 h-4 mr-2" /> Data
                            </label>
                            <input
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    {/* Botão de Submissão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-lg shadow-xl transition-all duration-300 mt-6 ${loading
                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                            : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            }`}
                    >
                        {/* 📍 A CORREÇÃO ESTÁ AQUI: */}
                        {loading ? 'Salvando...' : (isEditMode ? 'Atualizar Transação' : 'Salvar Transação')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;