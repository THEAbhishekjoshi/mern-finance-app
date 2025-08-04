import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const GaugeChart = ({ spentAmount, spendingLimit }) => {
  const remainingAmount = Math.max(spendingLimit - spentAmount, 0);
  // const percentage = Math.min((spentAmount / spendingLimit) * 100, 100).toFixed(0);
  const sections = 30
  const oneVal = sections / spendingLimit;
  const filledSections = Math.floor(oneVal * spentAmount);
  const unFilledSections = sections - filledSections;

  const dataValues = () => {
    const set = [];
    for (let i = 0; i < sections; i++) {
      if (i < filledSections) {
        set.push(spentAmount);
      } else {
        set.push(remainingAmount);
      }
    }
    return set;
  };
  const values = dataValues();

  const backgroundColors = () => {
    return values.map((data) =>
      data === spentAmount ? '#0F172A' : '#E2E8F0'
    );
  };

  const data = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        label: 'Spending Breakdown',
        data: values,
        backgroundColor: backgroundColors(), // dark slate + light gray
        borderWidth: 2,
        circumference: 180,
        rotation: 270,
        cutout: '60%',
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,//ignore its default aspect ratio and instead fully fill the height and width of its parent container.
    plugins: {
      // legend: {
      //   display: true,
      //   position: 'bottom',
      //   labels: {
      //   font: { size: 12 },
      //   color: '#374151', // gray-700
      //   },
      // },
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#1F2937', // gray-800
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 8,
      },
    },
  };

  return (
    <div className="relative w-48 h-24">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 pointer-events-none">
        <p className="text-xs text-gray-400 mt-6">Spent</p>
        <p className="text-lg font-bold text-slate-900">${spentAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default GaugeChart;
