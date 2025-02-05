import React, { useEffect, useRef } from 'react';
import { Col, Row } from 'antd';
import anime from 'animejs';
import 'animate.css';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const countRef = useRef(null);
  const countRefVehicle = useRef(null);
  const countRefCustomer = useRef(null);

  const totalDrivers = 20;
  const totalVehicles = 50;
  const totalCustomers = 109;

  useEffect(() => {
    [
      { ref: countRef, total: totalDrivers },
      { ref: countRefVehicle, total: totalVehicles },
      { ref: countRefCustomer, total: totalCustomers }
    ].forEach(({ ref, total }) => {
      anime({
        targets: ref.current,
        innerHTML: [total] + "+",
        easing: 'linear',
        round: 1,
        duration: 2000,
      });
    });
  }, []);

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const data = {
    labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ],
      borderWidth: 1,
    }],
  };

  const linedata = {
    labels,
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Data' },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className=" w-full p-4 h-full">
      <Row className="flex flex-col lg:flex-row gap-4">
        <Col className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {[
              { title: 'Total Drivers', ref: countRef },
              { title: 'Total Vehicles', ref: countRefVehicle },
              { title: 'Total Customers', ref: countRefCustomer }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate__animated animate__backInDown">
                <div className="flex flex-col items-center justify-center h-32">
                  <h2 className="text-xl text-sky-900 ">{item.title}</h2>
                  <span ref={item.ref} className="text-2xl font-semibold">0</span>
                </div>
              </div>
            ))}
          </div>

          {/* Title */}
          <div className=" flex justify-center text-center pt-2 pb-2">
            <h1 className="text-4xl md:text-6xl text-sky-900 animate__animated animate__backInLeft">mega ci</h1> <h1 className='text-4xl md:text-6xl text-sky-900 animate__animated animate__backInRight'>ty cab</h1>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate__animated animate__backInUp">
            <div className="bg-white rounded-lg shadow-lg p-4 h-96">
              <Bar data={data} options={chartOptions} />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 h-96">
              <Line data={linedata} options={chartOptions} />
            </div>
          </div>
        </Col>

        {/* Sidebar */}
        <Col className="w-full lg:w-72 bg-white shadow-lg rounded-xl p-4 animate__animated animate__backInRight">
          <h4 className="text-sky-900 font-normal">all active drivers</h4>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;