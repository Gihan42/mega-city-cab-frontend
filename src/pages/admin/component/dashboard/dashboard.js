import React from 'react'
import { Col, Row } from 'antd';
import { useEffect, useRef } from 'react';
import anime from 'animejs';
import 'animate.css';


function Dashboard() {
  const countRef = useRef(null);
  const countRefVehicle = useRef(null);
  const countRefCustomer = useRef(null);

  const totalDrivers = 20;
  const totalVehicles = 50;
  const totalCustomers = 109;

  useEffect(() => {
    anime({
      targets: countRef.current,
      innerHTML: [totalDrivers] + "+",
      easing: 'linear',
      round: 1,
      duration: 2000,
    });
    anime({
      targets: countRefVehicle.current,
      innerHTML: [totalVehicles] + "+",
      easing: 'linear',
      round: 1,
      duration: 2000,
    });
    anime({
      targets: countRefCustomer.current,
      innerHTML: [totalCustomers] + "+",
      easing: 'linear',
      round: 1,
      duration: 2000,
    });

    
  }, []);
  return (
    <div className='h-full w-full border-8 border-black'>
      <Row className='h-full'>
        <Col flex="1 1 200px" className='border-8 border-red-200'>

          <div className='flex items-center justify-center p-5  row grid gap-x-14'>

          <div
          className=" card shadow-lg flex rounded items-center justify-center flex-col animate__animated animate__backInDown"
          style={{ width: '24rem', height: '10rem' }}
        >
          <div className="card-body flex items-center justify-center flex-col">
            <h1 className="card-title mb-5 font-normal text-sky-900">Total Drivers</h1>
            <h2
              ref={countRef}
              className="card-subtitle mb-2 text-body-secondary font-normal"
            >
              0
            </h2>
          </div>
        </div>

        <div
          className=" card shadow-lg flex rounded items-center justify-center flex-col animate__animated animate__backInDown"
          style={{ width: '24rem', height: '10rem' }}
        >
              <div className="card-body flex items-center justify-center flex-col">
                <h1 className="card-title mb-5 font-normal text-sky-900">Total Vehicles</h1>
                <h2
                  ref={countRefVehicle}
                  className="card-subtitle mb-2 text-body-secondary font-normal"
                >
                  0
                </h2>
              </div>
            </div>

            <div
          className=" card shadow-lg flex rounded items-center justify-center flex-col animate__animated animate__backInDown"
          style={{ width: '24rem', height: '10rem' }}
        >              <div className="card-body flex items-center justify-center flex-col">
                <h1 className="card-title mb-5 font-normal	 text-sky-900">Total Customers</h1>
                <h2
                  ref={countRefCustomer}
                  className="card-subtitle mb-2 text-body-secondary font-normal"
                >
                  0
                </h2>
              </div>
            </div>

          </div>
          <div className='flex items-center justify-center animate__animated animate__backInLeft'>
                <h1  className='text-6xl text-sky-900	'>mega city cab</h1>
          </div>

        </Col>
        <Col flex="0 1 300px" className='border-8 border-red-800'>0 1 300px</Col>
      </Row>
    </div>
  )
}

export default Dashboard