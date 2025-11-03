
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

    const spentAmount = useMemo(() => {

        const budgetMonth = budget.month.slice(0, 7); 

        return transactions
            .filter(tx => {
                const isSameCategory = tx.categoria?.toLowerCase() === budget.category.toLowerCase();

                const txMonth = tx.data.slice(0, 7);
                const isSameMonth = txMonth === budgetMonth;

                const isExpense = tx.tipo === 'saida';

                return isSameCategory && isSameMonth && isExpense;
            })
            .reduce((acc, tx) => acc + tx.valor, 0); 

    }, [budget, transactions]);

    const percentage = (spentAmount / budget.amount) * 100;

    let progressBarColor = 'bg-green-500'; 
    if (percentage >= 75 && percentage < 95) {
        progressBarColor = 'bg-yellow-500'; 
    } else if (percentage >= 95) {
        progressBarColor = 'bg-red-500';
    }

    const widthPercentage = Math.min(percentage, 100);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-400">{formatMonth(budget.month)}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{budget.category}</h3>
                    </div>
                    <p className="text-2xl font-bold text-lime-400">{formatCurrency(budget.amount)}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-white font-medium">Gasto</span>
                    <span className="text-gray-400">
                        {formatCurrency(spentAmount)} de {formatCurrency(budget.amount)}
                    </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full ${progressBarColor} transition-all duration-500`}
                        style={{ width: `${widthPercentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
                <button
                    onClick={() => onEdit(budget)}
                    className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Editar Orçamento"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(budget)}
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