import React, { useEffect, useRef, useState } from 'react';

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



  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalVehicles, setTotalVehicle] = useState(0);
  const [totalCustomers, setTotalCustomer] = useState(0);
  const [drivers, setDrivers] = useState([]);


  //get driver count
  const getDriverCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setTotalDrivers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get vehicle count
  const getVehicleCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setTotalVehicle(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //get customer count
  const getCustomerCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setTotalCustomer(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //get all drivers
  const getAllDrivers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver/allDrivers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setDrivers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadDataInColumnChart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/payment/getPaymentByThisWeekDay`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);

        // Extract payment dates and total amounts from the response
        const labels = data.data.map(item => item.paymentDate); // Extract the dates (paymentDate)
        const amounts = data.data.map(item => item.totalAmount); // Extract the total amounts

        // Update the chart data dynamically
        setColumnChartData({
          labels: labels,
          datasets: [{
            label: 'Daily Payments',
            data: amounts,
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
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // bar chart state
  const [columnChartData, setColumnChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Daily Payments',
      data: [],
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
  });



  const loadDataInLineChart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/payment/totalPaymentinThisMonth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data);

        // Extract months and totalAmount from the response data
        const months = data.data.map(item => item.monthName);
        const amounts = data.data.map(item => item.totalAmount);

        // Update the chart data with the correct variable name
        setLineData({
          labels: months,
          datasets: [{
            label: 'Monthly Payments',
            data: amounts,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Line data chart state
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{
      label: 'Monthly Payments',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  });




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
  }, [totalDrivers, totalVehicles, totalCustomers]);

  useEffect(() => {
    loadDataInLineChart();
    loadDataInColumnChart();
    getCustomerCount();
    getDriverCount();
    getVehicleCount();
    getAllDrivers();
  }, []);



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className=" w-full p-4 h-full">
      <Row className="flex flex-col lg:flex-row gap-4">
        <Col className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-2xl">
            {[
              { title: 'Total Drivers', ref: countRef },
              { title: 'Total Vehicles', ref: countRefVehicle },
              { title: 'Total Customers', ref: countRefCustomer }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate__animated animate__backInDown">
                <div className="flex flex-col items-center justify-center h-32">
                  <h2 className="text-xl text-sky-900 ">{item.title}</h2>
                  <span ref={item.ref} className="text-4xl font-semibold">0</span>
                </div>
              </div>
            ))}
          </div>

          {/* Title */}
          <div className=" flex justify-center text-center pt-2 pb-2">
            <h1 className="text-4xl md:text-6xl text-sky-900 animate__animated animate__backInLeft">mega ci</h1> <h1 className='text-4xl md:text-6xl text-sky-900 animate__animated animate__backInRight'>ty cab</h1>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate_animated animate_backInUp">
            <div className="bg-white rounded-lg shadow-lg p-4 h-96">
              <Bar data={columnChartData} options={chartOptions} width='100%' height='100%' />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 h-96">
              <Line data={lineData} options={chartOptions} width='100%' height='100%' />
            </div>
          </div>
        </Col>

        {/* Sidebar */}
        <Col className="w-full lg:w-72 bg-white shadow-lg rounded-xl p-4 animate__animated animate__backInRight">
          <h4 className="text-sky-900 font-normal text-center mb-4">All Active Drivers</h4>

          {/* Scrollable Container with Inline Scrollbar Styles */}
          <div
            className="overflow-y-scroll h-96 justify-center mt-20 space-y-2"
            style={{
              scrollbarWidth: "none", /* Firefox */
            }}
          >
            <style>
              {`
        /* For Webkit Browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          display: none;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: transparent;
        }
      `}
            </style>

            {drivers.map((driver) => (
              <div
                key={driver.driverId}
                className="flex justify-between items-center bg-gray-100 shadow-md p-3 rounded-lg"
              >
                {/* Driver Name */}
                <span className="text-sky-900 font-medium">{driver.name}</span>
                {/* Online Icon */}
                <span className="text-green-500">
                  <i className="fas fa-circle text-xs"></i>
                </span>
              </div>
            ))}
          </div>
        </Col>



      </Row>
    </div>
  );
}

export default Dashboard;