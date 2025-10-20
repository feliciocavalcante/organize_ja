// src/components/Charts/MonthlyBarChart.jsx

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

// Precisamos registrar todos os "módulos" que um gráfico de barras usa
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
    
    // 1. Objeto para agrupar totais por mês (ex: "2025-10")
    const monthlyTotals = {};

    transactions.forEach(tx => {
      // Pega a data e formata para "YYYY-MM" (ex: "2025-09")
      // Adicionamos 'timeZone: UTC' para evitar problemas de fuso
      const date = new Date(tx.data);
      const monthKey = date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', timeZone: 'UTC' }); // 'sv-SE' dá o formato YYYY-MM
      
      // Se o mês ainda não existe no objeto, inicializa
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { entrada: 0, saida: 0 };
      }

      // Soma o valor no tipo correto (entrada ou saida)
      monthlyTotals[monthKey][tx.tipo] += tx.valor;
    });

    // 2. Ordenar os meses
    const sortedMonths = Object.keys(monthlyTotals).sort();

    // 3. Criar os arrays de dados para o gráfico
    const labels = sortedMonths.map(monthKey => {
      // Formata "2025-10" para "Out/2025" para ficar bonito no gráfico
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
          backgroundColor: 'rgba(74, 222, 128, 0.7)', // Verde (do seu logo)
          borderColor: 'rgba(74, 222, 128, 1)',
          borderWidth: 1,
        },
        {
          label: 'Saídas',
          data: expenseData,
          backgroundColor: 'rgba(248, 113, 113, 0.7)', // Vermelho
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 1,
        },
      ],
    };

  }, [transactions]); // Só recalcula se as transações mudarem

  // Opções para deixar o gráfico bonito no tema escuro
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb', // Texto da legenda (cinza claro)
          font: { size: 14 }
        }
      },
    },
    scales: {
      y: { // Eixo Y (Valores)
        ticks: { color: '#9ca3af', beginAtZero: true }, // Cor dos números
        grid: { color: '#374151' } // Cor das linhas de fundo
      },
      x: { // Eixo X (Meses)
        ticks: { color: '#9ca3af' }, // Cor dos meses
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