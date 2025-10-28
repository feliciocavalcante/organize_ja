
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyBarChart({ transactions }) {

  const chartData = useMemo(() => {
    
    const monthlyTotals = {};

    transactions.forEach(tx => {
      const date = new Date(tx.data);
      const monthKey = date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', timeZone: 'UTC' }); // 'sv-SE' dá o formato YYYY-MM
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { entrada: 0, saida: 0 };
      }

      monthlyTotals[monthKey][tx.tipo] += tx.valor;
    });

    const sortedMonths = Object.keys(monthlyTotals).sort();

    const labels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    });

    const incomeData = sortedMonths.map(monthKey => monthlyTotals[monthKey].entrada);
    const expenseData = sortedMonths.map(monthKey => monthlyTotals[monthKey].saida);

    return {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: incomeData,
          backgroundColor: 'rgba(74, 222, 128, 0.7)', 
          borderColor: 'rgba(74, 222, 128, 1)',
          borderWidth: 1,
        },
        {
          label: 'Saídas',
          data: expenseData,
          backgroundColor: 'rgba(248, 113, 113, 0.7)', 
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 1,
        },
      ],
    };

  }, [transactions]); 

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb', 
          font: { size: 14 }
        }
      },
    },
    scales: {
      y: { 
        ticks: { color: '#9ca3af', beginAtZero: true }, 
        grid: { color: '#374151' } 
      },
      x: { 
        ticks: { color: '#9ca3af' }, 
        grid: { color: '#374151' }
      }
    }
  };
  
  // Não mostrar o gráfico se não houver dados
  if (transactions.length === 0) {
    return (
       <div className="bg-gray-800 rounded-lg shadow-xl p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">Sem transações para exibir o gráfico.</p>
       </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default MonthlyBarChart;