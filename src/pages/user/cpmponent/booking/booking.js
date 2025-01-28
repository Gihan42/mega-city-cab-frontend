import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import CabImage from '../../../../assets/Flux_Dev_A_bustling_city_street_at_dusk_featuring_a_vintagesty_1.jpeg'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';

function Booking() {

    const [today, setToday] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        setToday(formattedDate);
    }, []);

    const carCategories = ['Economy', 'Standard', 'Luxury', 'Premium', 'Business', 'Shared', 'Outstation'];
    const [selectedCategory, setSelectedCategory] = useState(carCategories[0]);
    const carModels = {
        Economy: ['Model A', 'Model B', 'Model C'],
        Standard: ['Model D', 'Model E', 'Model F'],
        Luxury: ['Model G', 'Model H', 'Model I'],
        Premium: ['Model J', 'Model K', 'Model L'],
        Business: ['Model M', 'Model N', 'Model O'],
        Shared: ['Model P', 'Model Q', 'Model R'],
        Outstation: ['Model S', 'Model T', 'Model U'],
    };
    return (
        <div className="container mx-auto bg-slate-100 shadow-xl rounded-xl mt-32 px-4 py-8" id="booking">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-sky-900">Booking Now</h1>
                <hr className="border-t-4 border-black w-1/3"/>
            </div>
            <h1 className="text-2xl md:text-lg lg:text-xl mb-4 font-normal text-black">Select Car Category</h1>
            <div className="flex md:flex-row gap-4  p-4 flex-wrap mb-4 bg-white shadow-xl rounded-4  ">
                {carCategories.map((category, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedCategory(category)} // Set selected category on click
                        className={`rounded-5 px-4 py-2 font-medium transition-all  ${
                            selectedCategory === category
                                ? 'bg-[#0D3B66] text-white'
                                : 'bg-[#FCA000] text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <h1 className="text-2xl mb-4 md:text-lg lg:text-xl font-normal flex items-start justify-start text-black">Select Car Model</h1>
            <div className="flex md:flex-row gap-4 p-2 items-center justify-center flex-wrap">
                {carModels[selectedCategory].map((model, index) => (
                    <button
                        key={index}
                        type="button"
                        className="rounded px-4 py-2 transition-all"
                        style={{
                            backgroundColor: '#fff', // Set background color
                            color: '#0D3B66', // Text color
                            border: '2px solid #0D3B66', // Outline color
                            borderRadius: '8px', // Rounded edges
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0D3B66'; // Hover background color
                            e.target.style.color = '#FFFFFF'; // Hover text color
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fff'; // Reset background color
                            e.target.style.color = '#0D3B66'; // Reset text color
                        }}
                    >
                        {model}
                    </button>
                ))}
            </div>
            <div className="flex flex-col  mt-4 p-4 justify-center items-center bg-white shadow-xl rounded-4">
                <div
                    className="w-1/2 rounded-5 shadow-lg"
                    style={{
                        backgroundImage: `url(${CabImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '400px',
                    }}
                >

                </div>
            </div>
            <div className="flex md:flex-row gap-4 justify-center items-center mt-4  p-6 flex-wrap mb-4 ">
                <Card sx={{minWidth: 375}}  className=" cursor-pointer bg-slate-100 border-1 shadow-xl rounded-4 transform transition-transform duration-300 hover:scale-105">
                    <CardContent className='justify-center items-center flex flex-col gap-2'>
                        <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 35}}>
                            Vehicle
                        </Typography>
                        <Typography variant="h5" component="div">
                            wagonar
                        </Typography>
                        <Typography variant="h5" component="div">
                            SID-34567
                        </Typography>

                    </CardContent>
                </Card>
                <Card sx={{minWidth: 375}}
                      className=" cursor-pointer bg-slate-100 border-1 shadow-xl rounded-4 transform transition-transform duration-300 hover:scale-105">
                    <CardContent className='justify-center items-center flex flex-col gap-12'>
                        <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 35}}>
                            Price / Per KM
                        </Typography>
                        <Typography variant="h5" component="div"  sx={{color: 'text.secondary', fontSize: 25}}>
                            Rs 100.00
                        </Typography>

                    </CardContent>

                </Card>
                <Card sx={{minWidth: 375}}
                      className=" cursor-pointer bg-slate-100 border-1 shadow-xl rounded-4 transform transition-transform duration-300 hover:scale-105">
                    <CardContent className='justify-center items-center flex flex-col gap-2'>
                        <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 35}}>
                            Driver
                        </Typography>
                        <Typography variant="h5" component="div">
                            Mr Piyal Soriyapperuma
                        </Typography>
                        <Typography variant="h5" component="div"
                                    className='flex justify-center items-center w-full gap-4'>
                            075-49494093
                            <div
                                className="rounded-full p-1 hover:bg-sky-900  hover:text-white transition-all duration-300">
                                <PhoneForwardedIcon className="text-[#FCA000] hover:text-white" />
                            </div>


                        </Typography>
                    </CardContent>
                </Card>
            </div>
            <div className="flex md:flex-row gap-4 mt-4  p-4 flex-wrap mb-4 justify-center items-center  ">
                <button
                    type="submit"
                    className="btn btn-primary text-2xl"
                    style={{
                        marginTop: '1rem',
                        backgroundColor: '#FCA000',
                        color: '#0D3B66',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '50%',
                        fontSize: '1.5rem'
                    }}
                >
                    chose another cab
                </button>
            </div>
            <h1 className="text-2xl mb-4 md:text-2xl lg:text-2xl font-normal text-black">Confirm Your Booking</h1>
            <div className="bg-white shadow-xl rounded-4  mt-4 p-4">
                <Row className="mt-6 w-full flex flex-col lg:flex-row">
                    {/* Booking Form Column */}
                    <Col
                        span={24}
                        lg={12}
                        className="w-full bg-[#0A2136] rounded-lg shadow-lg p-4 md:p-6 lg:p-8"
                    >
                        <div className="mb-6 text-center">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                                Book Cab Now
                            </h1>
                        </div>

                        <form className="space-y-4">
                            {[
                                {label: 'name', type: 'text'},
                                {label: 'contact', type: 'text'},
                                {label: 'email', type: 'email'},
                                {label: 'start location', type: 'text'},
                                {label: 'end location', type: 'text'},
                                {label: 'date', type: 'date'}
                            ].map((field) => (
                                <div key={field.label} className="space-y-2">
                                    <label className="block text-sm md:text-base lg:text-lg text-white capitalize">
                                        {field.label}*
                                    </label>
                                    <input
                                        type={field.type}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                        min={field.type === 'date' ? today : undefined}
                                        placeholder={`Enter your ${field.label}`}
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full mt-8 bg-[#FCA000] text-[#0D3B66] py-3 px-6 rounded-lg
                     text-base md:text-lg font-semibold
                     transition-colors duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            >
                                Confirm Booking
                            </button>
                        </form>
                    </Col>

                    {/* Right Column - You can add content here */}
                    <Col
                        span={24}
                        lg={12}
                        className="w-full pl-0 lg:pl-4"
                    >
                        column 2
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Booking;
