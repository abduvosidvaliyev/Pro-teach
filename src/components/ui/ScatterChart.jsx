import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

// Helper: get all days in a month as ISO strings
const getAllDaysOfMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month - 1, 1);
    while (date.getMonth() === month - 1) {
        days.push(format(new Date(date), 'yyyy-MM-dd'));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

const ScatterChart = ({ expenses, selectedMonth }) => {
    // selectedMonth: 'YYYY-MM'
    const [year, month] = selectedMonth.split('-').map(Number);
    const labels = getAllDaysOfMonth(year, month);

    // Filter expenses for this month only
    const filteredExpenses = (expenses || []).filter(e => (e.date || '').startsWith(selectedMonth));

    const data = {
        datasets: [
            {
                label: 'Xarajatlar',
                data: filteredExpenses.map((expense) => ({
                    x: expense.date,
                    y: Number(expense.amount),
                })),
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    const maxAmount = Math.max(...filteredExpenses.map((e) => Number(e.amount)), 0);

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                min: labels[0],
                max: labels[labels.length - 1],
                title: {
                    display: true,
                    text: 'Sana',
                },
            },
            y: {
                beginAtZero: true,
                suggestedMax: maxAmount + 200,
                title: {
                    display: true,
                    text: 'Miqdori',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return <Scatter data={data} options={options} />;
};

export default ScatterChart;