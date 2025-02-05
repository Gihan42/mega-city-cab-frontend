import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import CabImage from '../../../../assets/Flux_Dev_A_bustling_city_street_at_dusk_featuring_a_vintagesty_1.jpeg'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './booking.css'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Booking() {
    const [startCity, setStartCity] = useState('');
    const [endCity, setEndCity] = useState('');
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [distance, setDistance] = useState(null);
    const [hours, setHours] = useState(null);
    const [total, setTotal] = useState(null);
    const [error, setError] = useState(null);
    const [minDateTime, setMinDateTime] = useState("");


    const fetchCoordinates = async (city) => {
        try {
            const response = await axios.get(
                'https://api.opencagedata.com/geocode/v1/json',
                {
                    params: {
                        key: '93beb5a1898643dc93c44f5a067910c3',
                        q: city,
                    },
                }
            );

            if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry;
                return { lat, lng };
            } else {
                throw new Error('City not found');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
            throw new Error('Failed to fetch coordinates. Please try again.');
        }
    };

    const getDistance = async () => {
        setError(null);
        setDistance(null);
        setRouteCoords([]);

        try {
            const start = await fetchCoordinates(startCity);
            const end = await fetchCoordinates(endCity);

            setStartCoords(start);
            setEndCoords(end);

            const response = await axios.get(
                `https://api.openrouteservice.org/v2/directions/driving-car`,
                {
                    params: {
                        api_key: '5b3ce3597851110001cf6248689430d1c5f14947bf211dce0d76348d',
                        start: `${start.lng},${start.lat}`,
                        end: `${end.lng},${end.lat}`,
                    },
                }
            );

            const distanceInKm =
                response.data.features[0].properties.segments[0].distance / 1000;
            setDistance(distanceInKm);
            setTotal(distanceInKm * 100);


            const durationInSec =
                response.data.features[0].properties.segments[0].duration;
            const durationInHours = (durationInSec / 3600).toFixed(2); // Convert seconds to hours

            // Set the calculated hours
            setHours(durationInHours);

            const route = response.data.features[0].geometry.coordinates.map(([lng, lat]) => ({
                lat,
                lng,
            }));
            setRouteCoords(route);
        } catch (error) {
            console.error('Error calculating distance:', error.message);
            setError(error.message || 'Error calculating distance. Please try again.');
        }
    };

    const [today, setToday] = useState('');

    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
        setMinDateTime(now.toISOString().slice(0, 16)); // Format: "YYYY-MM-DDTHH:MM"
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
                <hr className="border-t-4 border-black w-1/3" />
            </div>
            <h1 className="text-2xl md:text-lg lg:text-xl mb-4 font-normal text-black">Select Car Category</h1>
            <div className="flex md:flex-row gap-4  p-4 flex-wrap mb-4 bg-white shadow-xl rounded-4  ">
                {carCategories.map((category, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedCategory(category)} // Set selected category on click
                        className={`rounded-5 px-4 py-2 font-medium transition-all  ${selectedCategory === category
                            ? 'bg-[#0D3B66] text-white'
                            : 'bg-[#FCA000] text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <h1 className="text-2xl mb-4 md:text-lg lg:text-xl font-normal flex items-start justify-start text-black">Select
                Car Model</h1>
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
                <Card sx={{ minWidth: 375 }}
                    className=" cursor-pointer  border-1 text-white shadow-xl rounded-4 transform transition-transform duration-300 hover:scale-105">
                    <CardContent className='justify-center text-white bg-sky-950 items-center flex flex-col gap-2'>
                        <Typography gutterBottom sx={{ color: 'white', fontSize: 35 }}>
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
                <Card sx={{ minWidth: 375 }}
                    className=" cursor-pointer bg-slate-100 border-1 shadow-xl rounded-4 transform transition-transform duration-300 hover:scale-105">
                    <CardContent className='justify-center text-white bg-sky-950 items-center flex flex-col gap-12'>
                        <Typography gutterBottom sx={{ color: 'white', fontSize: 35 }}>
                            Price / Per KM
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ color: 'white', fontSize: 25 }}>
                            Rs 100.00
                        </Typography>

                    </CardContent>

                </Card>
                <Card sx={{ minWidth: 375 }}
                    className=" cursor-pointer bg-slate-100 border-1 shadow-xl rounded-4 transform transition-transform duration-300 hover:scale-105">
                    <CardContent className='justify-center items-center bg-sky-950 flex flex-col gap-2'>
                        <Typography gutterBottom sx={{ color: 'white', fontSize: 35 }}>
                            Driver
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ color: 'white' }}>
                            Mr Piyal Soriyapperuma
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ color: 'white' }}
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
            <div className="flex flex-col sm:flex-row justify-between gap-3 w-full mb-4 p-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-normal text-black">
                    Confirm Your Booking
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <button
                        type="button"
                        className={`rounded-5 px-4 py-2 font-medium text-sm sm:text-base transition-all whitespace-nowrap ${selectedCategory === 'Total'
                            ? 'bg-[#FCA000] text-white'
                            : 'bg-[#0D3B66] text-white hover:bg-[#0D3B66] hover:text-white'
                            }`}
                    >
                        Total: Rs {total || 0}
                    </button>

                    <button
                        type="button"
                        className={`rounded-5 px-4 py-2 font-medium text-sm sm:text-base transition-all whitespace-nowrap ${selectedCategory === 'Distance'
                            ? 'bg-[#FCA000] text-white'
                            : 'bg-[#0D3B66] text-white hover:bg-[#0D3B66] hover:text-white'
                            }`}
                    >
                        Total Distance: {distance ? distance.toFixed(2) : 0} km
                    </button>

                    <button
                        type="button"
                        className={`rounded-5 px-4 py-2 font-medium text-sm sm:text-base transition-all whitespace-nowrap ${selectedCategory === 'Time'
                            ? 'bg-[#FCA000] text-white'
                            : 'bg-[#0D3B66] text-white hover:bg-[#0D3B66] hover:text-white'
                            }`}
                    >
                        Estimated Time: {hours ? hours : 0} hours
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg mt-4">
                    <div className="flex flex-col lg:flex-row w-full gap-6 p-4">
                        {/* Booking Form */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-[#0A2136] rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
                                <div className="mb-6 text-center">
                                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                                        Book Cab Now
                                    </h1>
                                    <div className="text-sm md:text-base lg:text-lg text-white mt-2">
                                        Fill in the details below to confirm your booking
                                    </div>
                                </div>
                                <form className="space-y-4">
                                    {[
                                        { label: "name", type: "text" },
                                        { label: "contact", type: "text" },
                                        { label: "email", type: "email" },
                                        { label: "date & time", type: "datetime-local" }
                                    ].map((field) => (
                                        <div key={field.label} className="space-y-2">
                                            <label className="block text-sm md:text-base lg:text-lg text-white capitalize">
                                                {field.label}*
                                            </label>
                                            <input
                                                type={field.type}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300
                                focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                                placeholder={`Enter your ${field.label}`}
                                                min={field.type === "datetime-local" ? minDateTime : undefined} // Prevent past selection
                                                required
                                            />
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        className="btn btn-primary text-xl mt-6"
                                        style={{
                                            marginTop: "1rem",
                                            backgroundColor: "#FCA000",
                                            color: "#0D3B66",
                                            borderRadius: "10px",
                                            border: "none",
                                            cursor: "pointer",
                                            width: "100%",
                                            fontSize: "1.5rem"
                                        }}
                                    >
                                        Confirm Booking
                                    </button>
                                </form>


                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto">
                            <MapContainer
                                center={[51.505, -0.09]}
                                zoom={13}
                                className="w-full h-full rounded-lg"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {startCoords && <Marker position={[startCoords.lat, startCoords.lng]} />}
                                {endCoords && <Marker position={[endCoords.lat, endCoords.lng]} />}
                                {routeCoords.length > 0 && (
                                    <Polyline
                                        positions={routeCoords.map((point) => [point.lat, point.lng])}
                                        color="blue"
                                        weight={4}
                                        opacity={0.7}
                                    />
                                )}
                            </MapContainer>

                            <div
                                className="absolute bg-[#0A2136] bottom-4 left-1/2 transform -translate-x-1/2 w-[90%]  p-4 rounded-lg shadow-md">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Start Location"
                                        className=" w-full px-4 py-2 rounded-lg border border-gray-300 h-1/2
                                                 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all
                                        "
                                        value={startCity}
                                        onChange={(e) => setStartCity(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="End Location"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 h-1/2
                                                 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                        value={endCity}
                                        onChange={(e) => setEndCity(e.target.value)}
                                    />
                                    <button
                                        className="w-full sm:w-auto bg-[#FCA000] text-[#0D3B66] h-1/2  px-4 py-2
                                        rounded hover:bg-[#e69100] transition-colors"
                                        onClick={getDistance}
                                    >
                                        Find
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;
