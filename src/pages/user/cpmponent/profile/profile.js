import React, { useRef, useState } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';
import PasswordChange from'../../../passwordChange/passwordChange';

import {useNavigate} from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


function Profile() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetInputs = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    function logOut() {
        navigate('/');
    }
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
            status: 'close'
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
    const [clearData, setClearData] = useState({
        userId: '',
        userName: '',
        userEmail: '',
        userNic: '',
        userContact: '',
        userAddress: ''
        }


    );
    const filteredData = data.filter((item) => {
        return (
            (!searchFilters.bookingId || item.bookingId.toLowerCase().includes(searchFilters.bookingId.toLowerCase())) &&
            (!searchFilters.customerId || item.customer.toLowerCase().includes(searchFilters.customerId.toLowerCase())) &&
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

    return (
        <div className="container mx-auto  mb-4 px-4 py-8" id="profile">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-sky-900">Profile</h1>
                <hr className="border-t-4 border-black w-1/3"/>
                <div className='flex justify-end items-end mb-2 gap-6 animate__animated animate__backInRight'>
                    <button
                        className="btn btn-danger "
                        style={{
                            backgroundColor: '#FCA000',
                            color: '#0D3B66',
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
                    <button
                        className="btn btn-primary dcButton"
                        style={{
                            backgroundColor: '#0D3B66',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={logOut}
                    >
                        Logout
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
                                label=" User ID"
                                variant="outlined"
                                fullWidth
                                value={''}
                                onChange={''}
                                disabled={true}
                                sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            />
                            <TextField
                                id="userName"
                                label=" User Name"
                                variant="outlined"
                                fullWidth
                                value={''}
                                onChange={''}
                                sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            />
                            <TextField
                                id="userEmail"
                                label=" User Email"
                                variant="outlined"
                                fullWidth
                                disabled={true}
                                value={''}
                                onChange={''}
                                sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            />
                            <TextField
                                id="userNumber"
                                label=" User Nic"
                                variant="outlined"
                                fullWidth
                                value={''}
                                onChange={''}
                                sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            />
                            <TextField
                                id="userContact"
                                label=" User Contact"
                                variant="outlined"
                                fullWidth
                                value={''}
                                onChange={''}
                                sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            />

                        </div>
                        <div
                            className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full'>
                            <TextField
                                id="userAddress"
                                label=" User Address"
                                variant="outlined"
                                fullWidth
                                value={''}
                                onChange={''}
                                sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
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
                                    onClick={''}
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
                            sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon/>
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
                            sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon/>
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
                            sx={{marginBottom: '1rem', '& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon/>
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