import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = ({ color, amount, type }) => {
  const safeLabels = Array.isArray(type) ? type : type ? [type] : [];
  const safeData = Array.isArray(amount) ? amount : amount ? [amount] : [];
  const safeColors = Array.isArray(color) ? color : color ? [color] : [];

  const data = {
    labels: safeLabels,
    datasets: [
      {
        label: 'Qancha miqdorda',
        data: safeData,
        backgroundColor: safeColors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: '#fff',
        anchor: 'center',
        align: 'center',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = total === value ? 100 : (value / total) * 100;
          return `${percentage.toFixed(2)}%`;
        },
        font: {
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="w-[500px] h-[500px] ">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
