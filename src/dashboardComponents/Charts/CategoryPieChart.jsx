// src/components/Charts/CategoryPieChart.jsx

import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Precisamos "registrar" os elementos que o Chart.js vai usar
ChartJS.register(ArcElement, Tooltip, Legend);

// Função para gerar cores aleatórias (para o gráfico não ficar de uma cor só)
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.7)`; // 0.7 de opacidade
};


function CategoryPieChart({ transactions }) {

  // O useMemo é importante!
  // Ele evita que o gráfico seja recalculado toda hora, só quando as 'transactions' mudarem.
  const chartData = useMemo(() => {
    
    // 1. Filtrar apenas as 'saidas' (despesas)
    const expenses = transactions.filter(tx => tx.tipo === 'saida');

    // 2. Agrupar por categoria e somar os valores
    const categoryTotals = expenses.reduce((acc, tx) => {
      const category = tx.categoria || 'Sem Categoria'; // Garante uma categoria
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += tx.valor;
      
      return acc;
    }, {}); // Começa com um objeto vazio

    // 3. Formatar para o Chart.js
    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);
    
    // Gera uma cor para cada categoria
    const backgroundColors = labels.map(() => getRandomColor());

    return {
      labels: labels,
      datasets: [
        {
          label: 'Despesas por Categoria',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: '#1f2937', // Cor do fundo (dark)
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]); // Dependência: só recalcula se 'transactions' mudar

  // Opções de visualização do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Posição da legenda
        labels: {
          color: '#e5e7eb', // Cor do texto da legenda (cinza claro)
          font: {
            size: 14,
          }
        }
      },
    },
  };

  // Não mostrar o gráfico se não houver dados
  if (chartData.labels.length === 0) {
    return (
       <div className="bg-gray-900 rounded-lg shadow-xl p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">Sem dados de despesas para exibir o gráfico.</p>
       </div>
    )
  }

  return (
    // O card que "envolve" o gráfico
    <div className="bg-gray-900 rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Despesas por Categoria</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default CategoryPieChart;