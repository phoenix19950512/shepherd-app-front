import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function PerformanceChart(chartData) {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const arrData: Array<any> = [...chartData.chartData];

  useEffect(() => {
    const flashcardNames: any = arrData.map((item) => item.title);
    const flashcardPercentages: any = arrData.map((item) => item.totalScore);
    setLabels(flashcardNames);
    setValues(flashcardPercentages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  const abbreviatedLabels = labels.map((label: string) =>
    label.substring(0, 3)
  );

  const options = {
    responsive: true,
    // tooltips: {
    //   callbacks: {
    //     title: (tooltipItems, data) => {
    //       // Customize the title text
    //       return 'Custom Title';
    //     },
    //     label: (tooltipItem, data) => {
    //       // Customize the label text for each dataset
    //       const datasetLabel =
    //         data.datasets[tooltipItem.datasetIndex].label || '';
    //       return `${datasetLabel}: ${tooltipItem.yLabel}`;
    //     }
    //   }
    // },
    plugins: {
      legend: {
        position: 'top' as const,
        display: false
      },
      title: {
        display: false,
        text: 'Quiz Performance'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          callback: (value, index) => abbreviatedLabels[index]
        }
      },
      y: {
        grid: {
          display: true
        },
        max: 100,
        beginAtZero: true
      }
    }
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Score',
        data: values,
        backgroundColor: '#207df7',
        // barThickness:
        //   (100 - (datasetCount - 1) * categorySpacing) / datasetCount,
        barThickness: 15,
        borderRadius: 50
      }
    ]
  };

  return <Bar options={options} data={data} />;
}
