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
import './booking.css';
import { Alert } from 'antd';
import emailjs from 'emailjs-com';
import { useNavigate } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';


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
    const [minDateTime, setMinDateTime] = useState('');
    const [confirmBooking, confirmBookingSetAlertVisible] = useState(false);
    const [driverNotAailable, driverNotAvailableSetAlert] = useState(false);
    const [ifValidUser, ifValidUserSetAlert] = useState(false);
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [bookingDate, setBookingDate] = useState('');

    const fetchCoordinates = async (city) => {
        try {
            const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: {
                    key: '93beb5a1898643dc93c44f5a067910c3',
                    q: city,
                },
            });

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

            const response = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
                params: {
                    api_key: '5b3ce3597851110001cf6248689430d1c5f14947bf211dce0d76348d',
                    start: `${start.lng},${start.lat}`,
                    end: `${end.lng},${end.lat}`,
                },
            });

            const distanceInKm = response.data.features[0].properties.segments[0].distance / 1000;
            setDistance(distanceInKm);
            setTotal(distanceInKm * 100);

            const durationInSec = response.data.features[0].properties.segments[0].duration;
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

    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
        setMinDateTime(now.toISOString().slice(0, 16)); // Format: "YYYY-MM-DDTHH:MM"
    }, []);

    const [carCategories, setCarCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [carModels, setCarModels] = useState({});
    const [selectedModel, setSelectedModel] = useState(null);
    const [cabImage, setCabImage] = useState(null);
    const [plateNumber, setPlateNumber] = useState(null);
    const [pricePerKm, setPricerPerKm] = useState(null);
    const [dName, setDname] = useState(null);
    const [dContact, setDContact] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);
    const [dId, setDId] = useState(null);
    const [currentDate, setCurrentDate] = useState('');

    const handleChecked = () => {
        setChecked(!checked); // Toggle the checked state
    };

    useEffect(() => {
        const updateDate = () => {
            setCurrentDate(new Date().toISOString().split('T')[0]);
        };

        updateDate();
        const interval = setInterval(updateDate, 1000);

        return () => clearInterval(interval);
    }, []);

    // Fetch all car categories
    const getAllVehicleCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/category/allCategories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Response Data (Categories):', responseData.data);
                setCarCategories(responseData.data);

                // Set default selected category if categories exist
                if (responseData.data.length > 0) {
                    const defaultCategory = responseData.data[0];
                    setSelectedCategory(defaultCategory);
                    getAllCarModels(defaultCategory); // Fetch models for the first category
                }
            }
        } catch (error) {
            console.error('Error fetching vehicle categories:', error);
        }
    };

    // Fetch car models for a selected category
    const getAllCarModels = async (category) => {
        console.log('Fetching models for category:', category);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle?categoryName=${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Response Data (Car Models):', responseData.data);
                setCarModels((prevModels) => ({
                    ...prevModels,
                    [category]: responseData.data,
                }));
                if (responseData.data.length > 0) {
                    setSelectedModel(responseData.data[0]);
                    getRandomlyVehicle(responseData.data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching car models:', error);
        }
    };

    // Get randomly vehicle
    const getRandomlyVehicle = async (model) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle?model=${model}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Response Data cars:', responseData.data, vehicleId);
                setVehicleId(responseData.data.vehicleId);
                getBookingDateTimeByVehicleId(responseData.data.vehicleId);
                const base64Image = `data:image/jpeg;base64,${responseData.data.image}`;
                setCabImage(base64Image);
                setPlateNumber(responseData.data.plateNumber);
                setPricerPerKm(responseData.data.pricePerKm);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getBookingDateTimeByVehicleId = async (vehicleId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/booking?vehicleId=${vehicleId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseData = await response.json();
            if (response.ok) {
                // Ensure responseData.data is an array
                const datesArray = Array.isArray(responseData.data) ? responseData.data : [];
                setBookingDate(datesArray);
            }
        } catch (error) {
            console.log(error);
            setBookingDate([]); // Set to empty array in case of error
        }
    };

    // Get randomly driver
    const getRandomlyDriver = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver/getDriver`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log(responseData.data);
                setDname(responseData.data.name);
                setDContact(responseData.data.contactNumber);
                setDId(responseData.data.driverId);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllVehicleCategories();
        getRandomlyDriver();
    }, []);

    // Check if the selected category is valid before accessing car models
    const modelsForSelectedCategory = selectedCategory && carModels[selectedCategory] ? carModels[selectedCategory] : [];

    const [formData, setFormData] = useState({
        name: localStorage.getItem('name'),
        contact: '',
        email: localStorage.getItem('email'),
        dateTime: '',
    });

    const [isValid, setIsValid] = useState(false);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const utcDateTime = moment(date).utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
        return utcDateTime;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const { name, contact, email, dateTime } = formData;

        // Extract numeric hours from the `hours` string
        const numericHours = parseFloat(hours?.split(' ')[0] || 0); // Extracts the first part (e.g., "2" from "2 hours 68 seconds")

        setIsValid(
            name.trim() !== '' &&
            contact.trim() !== '' &&
            email.trim() !== '' &&
            dateTime.trim() !== '' &&
            Number(distance) > 0 &&
            numericHours > 0 && // Use numericHours instead of Number(hours)
            Number(total) > 0 &&
            checked
        );
    }, [formData, distance, hours, total, checked]);

    const formattedDateTime = formatDateTime(formData.dateTime);

    // Send mail
    const sendMail = (startLocation, endLocation, bookingId) => {
        const templateParams = {
            driver_name: dName,
            contact_email: formData.email,
            contact_phone: formData.contact,
            customer_name: formData.name,
            pickup_location: startLocation,
            drop_location: endLocation,
            booking_id: bookingId,
            booking_date: formattedDateTime,
            plate_number: plateNumber,
            model: selectedModel,
        };
        emailjs
            .send('service_bulp1em', 'template_sm6k6ag', templateParams, 'xvlC_Tt8GhRFq5k5R')
            .then(
                () => {
                    console.log('send mail');
                },
                (err) => console.log('Failed to send message', err)
            );
    };

    // Check a valid user
    const checkValidUser = async () => {
        if (!isValid) return;
        const userId = localStorage.getItem('id');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const jsonData = await response.json();
            if (response.ok) {
                if (jsonData.data) {
                    if (dName == '' || dName == null || dName == 'null') {
                        driverNotAvailableSetAlert(true);
                        setTimeout(() => {
                            driverNotAvailableSetAlert(false);
                        }, 6000);
                        return;
                    }
                    placeBooking(new Event('click'));
                } else {
                    ifValidUserSetAlert(true);
                    setFormData({
                        name: '',
                        contact: '',
                        email: '',
                    });
                    setStartCity('');
                    setEndCity('');
                    setDistance('');
                    setTotal('');
                    setHours('');
                    setTimeout(() => {
                        ifValidUserSetAlert(false);
                        navigate('/profile');
                    }, 6000);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Confirm booking
    const placeBooking = async (event) => {
        if (!isValid) return;
        event.preventDefault();
        console.log('Booking Details:', formData);

        const bookingRequest = {
            customerId: localStorage.getItem('id'),
            vehicleId: vehicleId,
            driverId: dId,
            pickUpLocation: startCity,
            dropLocation: endCity,
            hours: hours,
            totalKm: distance,
            bookingDateTime: formattedDateTime,
            amount: pricePerKm * distance,
            status: 'Confirmed',
        };
        console.log(bookingRequest);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/booking/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(bookingRequest),
            });
            const responseData = await response.json();
            if (response.ok) {
                payment(responseData.data.bookingId);
                confirmBookingSetAlertVisible(true);
                setFormData({
                    name: '',
                    contact: '',
                    email: '',
                });
                setStartCity('');
                setEndCity('');
                setDistance('');
                setTotal('');
                setHours('');
                sendMail(startCity, endCity, responseData.data.bookingId);
                setTimeout(() => {
                    confirmBookingSetAlertVisible(false);
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setError(true);
            setTimeout(() => {
                setError(false);
                setStartCity('');
                setEndCity('');
                setDistance('');
                setTotal('');
                setHours('');
                setFormData({
                    name: '',
                    contact: '',
                    email: '',
                    dateTime: '',
                });
            }, 3000);
        }
    };

    // Payment function
    const payment = async (bookingId) => {
        const paymentRequest = {
            bookingId: bookingId,
            amount: pricePerKm * distance,
            date: currentDate,
            paymentMethod: 'visa',
            currency: 'lkr',
            customerId: localStorage.getItem('id'),
            vehicleId: vehicleId,
            status: 'paid',
        };
        console.log(paymentRequest)

        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/payment/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(paymentRequest),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log(responseData);

                // Save paymentId to localStorage
                localStorage.setItem('paymentId', responseData.data.payment.paymentId);

                // Open Stripe Payment Page in a New Tab
                window.location.href = responseData.data.sessionUrl;

            } else {
                throw new Error('Failed to save payment');
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        }
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
                        onClick={() => {
                            setSelectedCategory(category);
                            getAllCarModels(category);
                        }}
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
                {modelsForSelectedCategory.length > 0 ? (
                    modelsForSelectedCategory.map((model, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => { setSelectedModel(model); getRandomlyVehicle(model) }}
                            className={`px-4 py-2 font-medium transition-all border-2 border-[#0D3B66] rounded-md
                                    ${selectedModel === model
                                    ? 'bg-[#0D3B66] text-white'
                                    : 'bg-white text-[#0D3B66] hover:bg-[#FCA000] hover:text-[#0D3B66]'}`
                            }
                        >
                            {model}
                        </button>
                    ))
                ) : (
                    <p>Please select a category to see the models.</p>
                )}
            </div>
            <div className="flex flex-col md:flex-row mt-4 p-2 md:p-4 bg-white shadow-xl rounded-lg gap-4">
                {/* Image Container - Full width on mobile, half on desktop */}
                <div className="w-full md:w-1/2 h-48 md:h-[400px] rounded-lg shadow-lg overflow-hidden">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: cabImage ? `url(${cabImage})` : 'none'
                        }}
                    />
                    
                </div>

                {/* Booking Dates Container */}
                <div className="w-full md:w-1/2 flex flex-col bg-gray-100 shadow-md p-3 rounded-lg min-h-[200px] md:h-[400px]">
                    {/* Header */}
                    <div className="text-sky-900 text-lg font-semibold mb-3 sticky top-0 bg-gray-100 py-2 px-2">
                        Booking Dates
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1 scrollbar">
                        {Array.isArray(bookingDate) && bookingDate.length > 0 ? (
                            <div className="space-y-2 p-2">
                                {bookingDate.map((date, index) => {
                                    const dateObj = new Date(date);
                                    const formattedDate = dateObj.toISOString().split('T')[0];
                                    const formattedTime = dateObj.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sky-900 font-medium">{formattedDate}</span>
                                                <span className="text-sm text-gray-500">{formattedTime}</span>
                                            </div>
                                            <span className="text-blue-500">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-sky-900 font-medium">Not Available Any Day</span>
                            </div>
                        )}
                    </div>

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
                            {selectedModel}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {plateNumber}
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
                            RS {pricePerKm}.00
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
                            Mr {dName}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ color: 'white' }}
                            className='flex justify-center items-center w-full gap-4'>
                            {dContact}
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
                    type="button"
                    className="custom-button"
                    onClick={() => getRandomlyVehicle(selectedModel)}
                >
                    Choose Another Cab
                </button>
            </div>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {confirmBooking && (
                    <Alert
                        className='w-96 mb-5'
                        message="Confirm Your Booking"
                        type="success"
                        showIcon
                        action={
                            <Button size="small" type="text">
                                UNDO
                            </Button>
                        }
                        closable
                    />
                )}
            </div>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {driverNotAailable && (
                    <Alert
                        className='w-96 mb-5'
                        message="driver not availble"
                        type="warning"
                        showIcon
                        action={
                            <Button size="small" type="text">
                                UNDO
                            </Button>
                        }
                        closable
                    />
                )}
            </div>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {error && (
                    <Alert
                        message="Error"
                        description="somthing went wrong try again"
                        type="error"
                        showIcon
                    />
                )}
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
                        Total: Rs {pricePerKm * distance || 0}
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
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {ifValidUser && (
                    <Alert
                        className='w-96 mb-5'
                        message="Please Update Your Details"
                        type="warning"
                        showIcon
                        action={
                            <Button size="small" type="text">
                                UNDO
                            </Button>
                        }
                        closable
                    />
                )}
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
                                        { label: "name", type: "text", name: "name" },
                                        { label: "contact", type: "text", name: "contact" },
                                        { label: "email", type: "email", name: "email" },
                                        { label: "date & time", type: "datetime-local", name: "dateTime" },
                                    ].map((field) => (
                                        <div key={field.label} className="space-y-2">
                                            <label className="block text-sm md:text-base lg:text-lg text-white capitalize">
                                                {field.label}*
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                                placeholder={`Enter your ${field.label}`}
                                                min={field.type === "datetime-local" ? minDateTime : undefined} // Prevent past selection
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Checkbox
                                            checked={checked}
                                            onChange={handleChecked}
                                            style={{ fontSize: '30px', color: '#fff' }}
                                        />
                                        <span
                                            data-bs-toggle="modal"
                                            data-bs-target="#term"
                                            style={{ fontSize: '18px', color: '#fff', cursor: 'pointer' }}
                                        >
                                            Agree to terms and conditions
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`btn btn-primary text-xl mt-6 ${isValid ? "" : "opacity-50 cursor-not-allowed"}`}
                                        style={{
                                            marginTop: "1rem",
                                            backgroundColor: isValid ? "#FCA000" : "#ddd",
                                            color: isValid ? "#0D3B66" : "#999",
                                            borderRadius: "10px",
                                            border: "none",
                                            cursor: isValid ? "pointer" : "not-allowed",
                                            width: "100%",
                                            fontSize: "1.5rem",
                                        }}
                                        onClick={checkValidUser}
                                        disabled={!isValid}
                                    >
                                        Confirm Booking
                                    </button>
                                </form>


                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto">
                            <MapContainer
                                center={[7.8731, 80.7718]} // Set the center to Sri Lanka
                                zoom={8} // Adjust the zoom level to focus on Sri Lanka
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


            {/* model */}
            <div className="modal fade" id="term" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Terms & Conditions</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-6 text-justify leading-relaxed text-gray-800 max-h-96 overflow-y-auto">
                            <p className="mb-4">
                                By confirming your booking and completing the payment, you acknowledge and agree to the
                                following terms and conditions. Once a booking is confirmed and payment is processed,
                                <strong>no refunds will be issued</strong>, even if you choose to cancel the booking.
                            </p>

                            <p className="mb-4">
                                Upon confirmation, a bill will be issued for your booking. You must present this bill
                                to the driver before boarding the cab. <strong>Failure to show the bill may result in
                                    denial of service without a refund.</strong>
                            </p>

                            <p className="mb-4">
                                The driver will be dispatched to your designated start location at the agreed pick-up time
                                and will wait for a maximum of <strong>15 minutes</strong>. If you fail to arrive within
                                this waiting period, the booking will be considered canceled, and no refund will be provided.
                            </p>

                            <p className="mb-4">
                                It is the customer’s responsibility to ensure all booking details are accurate and
                                to be present at the specified location on time. The service provider reserves the right
                                to cancel bookings due to unforeseen circumstances such as <strong>driver unavailability,
                                    vehicle issues, or extreme weather conditions</strong>, and any refunds in such cases
                                will be at the sole discretion of the service provider.
                            </p>

                            <p className="mb-4">
                                Delays caused by traffic, road conditions, or other external factors are beyond the
                                service provider’s control, and no liability will be accepted for such delays.
                            </p>

                            <p className="mb-4">
                                Additionally, customers must behave respectfully toward drivers and comply with
                                safety instructions. The driver reserves the right to <strong>terminate the service
                                    without a refund</strong> in case of inappropriate behavior.
                            </p>

                            <p className="font-semibold text-center">
                                By confirming your booking, you accept and agree to these terms and conditions in full.
                            </p>
                        </div>



                    </div>
                </div>
            </div>

        </div>
    );
}

export default Booking;
