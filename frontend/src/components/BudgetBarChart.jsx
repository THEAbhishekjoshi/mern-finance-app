import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import groupTransactionsByMonth from './groupTransactionByMonth';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const BudgetBarChart = ({ transactions }) => {
  const chartData = groupTransactionsByMonth(transactions);
  //console.log('income:', inc, 'expense:', exp);

  const data = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        label: "Income",
        data: chartData.map((item) => item.income),
        backgroundColor: "rgba(147, 197, 253, 1)", // light blue from image
        borderRadius: 8,
      },
      {
        label: "Expense",
        data: chartData.map((item) => item.expense),
        backgroundColor: "rgba(30, 41, 59, 1)", // dark slate from image
        borderRadius: 8,
      },
    ],
  }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 16,
            boxHeight: 16,
            padding: 12,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `$${context.raw.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `$${value}`;
            },
          },
        },
      },
    };

    return<Bar data = { data } options = { options } />;
};

export default BudgetBarChart;
