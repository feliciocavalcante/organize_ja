
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.7)`; 
};

function CategoryPieChart({ transactions }) {

  const chartData = useMemo(() => {
    
    const expenses = transactions.filter(tx => tx.tipo === 'saida');

    const categoryTotals = expenses.reduce((acc, tx) => {
      const category = tx.categoria || 'Sem Categoria'; 
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += tx.valor;
      
      return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);
    
    const backgroundColors = labels.map(() => getRandomColor());

    return {
      labels: labels,
      datasets: [
        {
          label: 'Despesas por Categoria',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: '#1f2937', 
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]); 

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', 
        labels: {
          color: '#e5e7eb', 
          font: {
            size: 14,
          }
        }
      },
    },
  };

  if (chartData.labels.length === 0) {
    return (
       <div className="bg-gray-900 rounded-lg shadow-xl p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">Sem dados de despesas para exibir o gráfico.</p>
       </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Despesas por Categoria</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default CategoryPieChart;