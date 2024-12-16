import React, { useState } from "react";

import { Modal, Button, Form } from "react-bootstrap";
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const TaskDashboard = () => {
  // Data for the charts
  const taskData = {
    completed: 45,
    pending: 25,
    toDo: 30,
  };

  // Prepare data for Pie Chart
  const pieData = {
    labels: ['Completed', 'Pending', 'To-Do'],
    datasets: [
      {
        label: 'Tasks',
        data: [taskData.completed, taskData.pending, taskData.toDo],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
        borderColor: ['#4caf50', '#ff9800', '#2196f3'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Bar Chart
  const barData = {
    labels: ['Completed', 'Pending', 'To-Do'],
    datasets: [
      {
        label: 'Tasks',
        data: [taskData.completed, taskData.pending, taskData.toDo],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Task Dashboard</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        {/* Pie Chart */}
        <div style={{ width: '40%' }}>
          <h3 style={{ textAlign: 'center' }}>Task Distribution (Pie Chart)</h3>
          <Pie data={pieData} />
        </div>

        {/* Bar Chart */}
        <div style={{ width: '40%' }}>
          <h3 style={{ textAlign: 'center' }}>Task Statistics (Bar Chart)</h3>
          <Bar data={barData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
