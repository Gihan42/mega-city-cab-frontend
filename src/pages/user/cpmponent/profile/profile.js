import React, { useRef, useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';
import PasswordChange from '../../../passwordChange/passwordChange';
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Contact } from 'lucide-react';

function Profile() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [nic, setNic] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [userUpdateAlert, userUpdateSetAlertVisible] = useState(false);
    const [error, somethingError] = useState(false);

    // State for validation errors
    const [errors, setErrors] = useState({
        userName: '',
        nic: '',
        contact: '',
        address: '',
    });

    const resetInputs = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    function backtoHome() {
        navigate('/User');
    }

    const [data, setFilteredData] = useState(
        Array.from({ length: 20 }).map((_, index) => ({
            bookingId: `BID-${index + 1}`,
            customer: `Customer ${index + 1}`,
            driver: `Driver ${index + 1}`,
            vehicle: `Vehicle ${index + 1}`,
            date: new Date().toISOString().slice(0, 10),
            pickUpLocation: 'null',
            destination: 'null',
            totalAmount: 'null',
        }))
    );

    const handleResetFilters = () => {
        setSearchFilters({
            bookingId: '',
            customerId: '',
            driverId: '',
            vehicleId: '',
            bookingDate: '',
            status: ''
        });

        setFilteredData(data);
    };

    const [searchFilters, setSearchFilters] = useState({
        bookingId: '',
        customerId: '',
        driverId: '',
        vehicleId: '',
        bookingDate: '',
        status: ''
    });

    const filteredData = data.filter((item) => {
        return (
            (!searchFilters.bookingId || item.bookingId.toString().includes(searchFilters.bookingId.toString())) &&
            (!searchFilters.customerId || item.customer.toString().includes(searchFilters.customerId.toString())) &&
            (!searchFilters.driverId || item.driver.toLowerCase().includes(searchFilters.driverId.toLowerCase())) &&
            (!searchFilters.vehicleId || item.vehicle.toLowerCase().includes(searchFilters.vehicleId.toLowerCase())) &&
            (!searchFilters.status || item.status.toLowerCase().includes(searchFilters.status.toLowerCase())) &&
            (!searchFilters.bookingDate || item.date === searchFilters.bookingDate)
        );
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSearchFilters((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleRowClick = (item) => {
        setSearchFilters({
            bookingId: item.bookingId,
            customerId: item.customer,
            driverId: item.driver,
            vehicleId: item.vehicle,
            bookingDate: item.date,
            status: item.status
        });
    };

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'userName':
                if (!value.trim()) return 'User Name is required';
                if (value.length < 3) return 'User Name must be at least 3 characters';
                if (!/^[A-Za-z\s]+$/.test(value)) return 'User Name cannot contain numbers' 
                return '';
            case 'nic':
                if (!value.trim()) return 'NIC is required';
                return '';
            case 'contact':
                if (!value.trim()) return 'Contact is required';
                if (!/^\d{10}$/.test(value)) return 'Contact must be 10 digits';
                return '';
            case 'address':
                if (!value.trim()) return 'Address is required';
                return '';
            default:
                return '';
        }
    };

    const handleProfileInputChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'userName':
                setUserName(value);
                setErrors({ ...errors, userName: validateField('userName', value) });
                break;
            case 'userNumber':
                setNic(value);
                setErrors({ ...errors, nic: validateField('nic', value) });
                break;
            case 'userContact':
                setContact(value);
                setErrors({ ...errors, contact: validateField('contact', value) });
                break;
            case 'userAddress':
                setAddress(value);
                setErrors({ ...errors, address: validateField('address', value) });
                break;
            default:
                break;
        }
    };

    // Update user with validation
    const updateUser = async (event) => {
        event.preventDefault();

        // Validate all fields
        const newErrors = {
            userName: validateField('userName', userName),
            nic: validateField('nic', nic),
            contact: validateField('contact', contact),
            address: validateField('address', address),
        };
        setErrors(newErrors);

        // Check if there are any errors
        if (Object.values(newErrors).every((error) => !error)) {
            const userRequest = {
                id: userId,
                username: userName,
                password: "123",
                contactNumber: contact,
                email: email,
                address: address,
                nic: nic,
                status: '1',
                role: "Admin",
            };

            try {
                const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(userRequest)
                });
                const responseData = await response.json();
                if (response.ok) {
                    console.log(responseData);
                    userUpdateSetAlertVisible(true);
                    setTimeout(() => {
                        userUpdateSetAlertVisible(false);
                    }, 3000);
                }
            } catch (error) {
                console.log(error);
                somethingError(true);
                setTimeout(() => {
                    somethingError(false);
                }, 3000);
            }
        } else {
            console.log('Form has errors');
        }
    };

    // Load user details
    const loadUserDetails = async () => {
        const userId = localStorage.getItem('id');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user?uId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const jsonData = await response.json();
            if (response.ok) {
                setUserId(jsonData.data.userId);
                setUserName(jsonData.data.username);
                setEmail(jsonData.data.email);
                setNic(jsonData.data.nic);
                setContact(jsonData.data.contactNumber);
                setAddress(jsonData.data.address);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Load booking details
    const loadBookingDetails = async () => {
        const userId = localStorage.getItem('id');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/booking?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                const mappedData = responseData.data.map((item) => ({
                    bookingId: item.bookingId,
                    customer: item.userId,
                    driver: `${item.driverId}-${item.driverName}`,
                    vehicle: `${item.vehiclePlateNumber}-${item.vehicleModel}`,
                    date: item.bookingDate.split("T")[0],
                    pickUpLocation: item.startLocation,
                    destination: item.dropLocation,
                    totalAmount: item.amount,
                }));
                setFilteredData(mappedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUserDetails();
        loadBookingDetails();
    }, []);


    return (
        <div className="container mx-auto  mb-4 px-4 py-8" id="profile">
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
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {userUpdateAlert && (
                    <Alert
                        className='w-96 mb-5'
                        message="Updated"
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
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-sky-900">Profile</h1>
                <hr className="border-t-4 border-black w-1/3" />
                <div className='flex justify-end items-end mb-2 gap-6 animate__animated animate__backInRight'>
                    <button
                        className="btn btn-danger "
                        style={{
                            backgroundColor: '#0D3B66',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={backtoHome}
                    >
                        back to home page
                    </button>
                    <button
                        className="btn btn-primary dcButton" data-bs-toggle="modal" data-bs-target="#exampleModal"
                        style={{
                            backgroundColor: '#008000',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                        }}

                    >
                        Change Password
                    </button>
                </div>
            </div>
            <Row>
                <Col
                    className=' h-auto w-full bg-white rounded-xl mb-4 shadow-lg flex flex-col p-2 animate__animated animate__backInDown'>
                    <form className="flex flex-col  justify-center items-center  h-auto w-full">
                        <div
                            className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full '>
                                                        <TextField
                                id="userId"
                                label="User ID"
                                variant="outlined"
                                fullWidth
                                value={userId}
                                disabled={true}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                id="userName"
                                label="User Name"
                                variant="outlined"
                                fullWidth
                                value={userName}
                                onChange={handleProfileInputChange}
                                error={!!errors.userName}
                                helperText={errors.userName}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                id="userEmail"
                                label="User Email"
                                variant="outlined"
                                fullWidth
                                disabled={true}
                                value={email}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                id="userNumber"
                                label="User NIC"
                                variant="outlined"
                                fullWidth
                                value={nic}
                                onChange={handleProfileInputChange}
                                error={!!errors.nic}
                                helperText={errors.nic}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                id="userContact"
                                label="User Contact"
                                variant="outlined"
                                fullWidth
                                value={contact}
                                onChange={handleProfileInputChange}
                                error={!!errors.contact}
                                helperText={errors.contact}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                        </div>
                        <div className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full'>
                            <TextField
                                id="userAddress"
                                label="User Address"
                                variant="outlined"
                                fullWidth
                                value={address}
                                onChange={handleProfileInputChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <button type="button" className="btn btn-primary dcButton"
                                style={{
                                    id: 'dcButton',
                                    backgroundColor: '#008000',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '40%',
                                }}
                                onClick={updateUser}
                            >
                                update
                            </button>
                            <button type="button" className="btn btn-primary dcButton"
                                style={{
                                    id: 'dcButton',
                                    backgroundColor: '#C1121F',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '40%',
                                }}
                                onClick={handleResetFilters}
                            >
                                clear
                            </button>


                        </div>
                    </form>
                </Col>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    {/*popup*/}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Change Your Password</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close" onClick={resetInputs}></button>
                            </div>
                            <div className="modal-body">
                                <PasswordChange

                                    currentPassword={currentPassword}
                                    setCurrentPassword={setCurrentPassword}
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    resetInputs={resetInputs}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </Row>
            <Row>
                <Col
                    className=' h-auto w-full  flex flex-col p-2 animate__animated animate__backInLeft'>
                    <form className="flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full">
                        <TextField
                            id="bookingId"
                            label="Search by Booking ID"
                            variant="outlined"
                            fullWidth
                            value={searchFilters.bookingId}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            id="driverId"
                            label="Search by Driver ID"
                            variant="outlined"
                            fullWidth
                            value={searchFilters.driverId}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            id="vehicleId"
                            label="Search by Vehicle ID"
                            variant="outlined"
                            fullWidth
                            value={searchFilters.vehicleId}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            id="bookingDate"
                            variant="outlined"
                            fullWidth
                            type="date"
                            value={searchFilters.bookingDate}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />

                    </form>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} className="flex justify-center items-center p-2 h-full animate__animated animate__backInUp">
                    <div
                        className="overflow-x-auto table-container max-h-[450px] w-full border border-gray-300 rounded-lg"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#0D3B66 #E4E4E7',
                        }}
                    >
                        <table className="table-auto w-full text-lg text-left border-collapse">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="border px-4 py-2">#</th>
                                    <th className="border px-4 py-2">Booking ID</th>
                                    <th className="border px-4 py-2">Driver</th>
                                    <th className="border px-4 py-2">Vehicle</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Pick Up Location</th>
                                    <th className="border px-4 py-2">Destination</th>
                                    <th className="border px-4 py-2">Total Amount</th>


                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.bookingId}</td>
                                        <td className="border px-4 py-2">{item.driver}</td>
                                        <td className="border px-4 py-2">{item.vehicle}</td>
                                        <td className="border px-4 py-2">{item.date}</td>
                                        <td className="border px-4 py-2">{item.pickUpLocation}</td>
                                        <td className="border px-4 py-2">{item.destination}</td>
                                        <td className="border px-4 py-2">{item.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>


        </div>
    );
}

export default Profile;