
import React, { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const formatMonth = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

const formatCurrency = (value) => {
    return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

function BudgetProgressCard({ budget, transactions, onEdit, onDelete }) {

    // useMemo é crucial! Ele só recalcula o gasto quando o orçamento ou as transações mudam.
    const spentAmount = useMemo(() => {

        // 1. Pega o mês do orçamento, ex: "2025-10"
        const budgetMonth = budget.month.slice(0, 7); // Pega "YYYY-MM"

        // 2. Filtra e soma as transações
        return transactions
            .filter(tx => {
                // 3. O gasto é da mesma categoria? (Ex: "Alimentação")
                const isSameCategory = tx.categoria?.toLowerCase() === budget.category.toLowerCase();

                // 4. O gasto é do mesmo mês?
                const txMonth = tx.data.slice(0, 7); // Pega "YYYY-MM" da transação
                const isSameMonth = txMonth === budgetMonth;

                // 5. O gasto é uma 'saida'?
                const isExpense = tx.tipo === 'saida';

                return isSameCategory && isSameMonth && isExpense;
            })
            .reduce((acc, tx) => acc + tx.valor, 0); // 6. Soma o total

    }, [budget, transactions]);

    // Calcula a porcentagem
    const percentage = (spentAmount / budget.amount) * 100;

    // Define a cor da barra (verde, amarelo, vermelho)
    let progressBarColor = 'bg-green-500'; // Abaixo de 75%
    if (percentage >= 75 && percentage < 95) {
        progressBarColor = 'bg-yellow-500'; // Entre 75% e 95%
    } else if (percentage >= 95) {
        progressBarColor = 'bg-red-500'; // Acima de 95%
    }

    // Garante que a barra não passe de 100%
    const widthPercentage = Math.min(percentage, 100);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between">
            {/* --- Seção Superior (Infos) --- */}
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-400">{formatMonth(budget.month)}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{budget.category}</h3>
                    </div>
                    {/* Valor Total do Orçamento */}
                    <p className="text-2xl font-bold text-lime-400">{formatCurrency(budget.amount)}</p>
                </div>
            </div>

            {/* --- Seção Inferior (Progresso) --- */}
            <div className="mt-4 pt-4 border-t border-gray-700">
                {/* Texto: "Gasto R$ X de R$ Y" */}
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-white font-medium">Gasto</span>
                    <span className="text-gray-400">
                        {formatCurrency(spentAmount)} de {formatCurrency(budget.amount)}
                    </span>
                </div>

                {/* A Barra de Progresso */}
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full ${progressBarColor} transition-all duration-500`}
                        style={{ width: `${widthPercentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
                <button
                    onClick={() => onEdit(budget)} // Chama a função onEdit com os dados do orçamento
                    className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Editar Orçamento"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(budget)} // Chama a função onDelete com os dados do orçamento
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Excluir Orçamento"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default BudgetProgressCard;