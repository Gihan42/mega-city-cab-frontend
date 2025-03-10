import React, { useState, useEffect, useRef } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';
import Checkbox from '@mui/material/Checkbox';

function Vehicle() {
    const [pdfAndCsvAlertVisible, pdfCsvSetAlertVisible] = useState(false);
    const [error, somethingError] = useState(false);
    const [saveVehicleAlertVisible, saveVehicleSetAlertVisible] = useState(false);
    const [updateVehicleAlertVisible, updateVehicleSetAlertVisible] = useState(false);
    const [deleteVehicleAlertVisible, deleteVehicleSetAlertVisible] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isRowSelected, setIsRowSelected] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setSelectedImage(imageUrl);
            setSearchFilters((prev) => ({
                ...prev,
                image: file,
            }));
        }
    }

    const [searchFilters, setSearchFilters] = useState({
        vehicleId: '',
        model: '',
        plateNumber: '',
        pricePerKm: '',
        passengersCount: '',
        category: '',
        image: '',
    });

    const defaultImage = 'https://via.placeholder.com/150';
    const [data, setFilteredData] = useState(
        Array.from({ length: 20 }).map((_, index) => ({
            vehicleId: "loading",
            model: "loading",
            plateNumber: "loading",
            pricePerKm: "loading",
            passengersCount: "loading",
            category: "loading",
            image: "loading",
        }))
    );

    const handleResetFilters = () => {
        setSearchFilters({
            vehicleId: '',
            model: '',
            plateNumber: '',
            pricePerKm: '',
            passengersCount: '',
            category: '',
            image: '',
        });
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsRowSelected(false);
        setImage(null);
        setFilteredData(data);
    };

    const filteredData = data.filter((item) => {
        return (
            (!searchFilters.vehicleId || item.vehicleId.toString().includes(searchFilters.vehicleId.toString())) &&
            (!searchFilters.model || item.model.toLowerCase().includes(searchFilters.model.toLowerCase())) &&
            (!searchFilters.plateNumber || item.plateNumber.toLowerCase().includes(searchFilters.plateNumber.toLowerCase())) &&
            (!searchFilters.pricePerKm || item.pricePerKm.toString().includes(searchFilters.pricePerKm.toString())) &&
            (!searchFilters.passengersCount || item.passengersCount.toString().includes(searchFilters.passengersCount.toString())) &&
            (!searchFilters.category || item.category.toLowerCase().includes(searchFilters.category.toLowerCase())) &&
            (!searchFilters.image || item.image.toString().includes(searchFilters.image.toString()))

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
            vehicleId: item.vehicleId,
            model: item.model,
            plateNumber: item.plateNumber,
            pricePerKm: item.pricePerKm,
            passengersCount: item.passengersCount,
            category: item.category,
            image: item.image,
        });

        setIsRowSelected(true);
        if (item.image) {
            if (item.image.startsWith("data:image")) {
                setSelectedImage(item.image);
            }
            else if (typeof item.image === 'string') {
                setSelectedImage(`data:image/jpeg;base64,${item.image.trim()}`);
            }
        } else {
            setSelectedImage(defaultImage);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('vehicle Table', 14, 10);
        doc.autoTable({
            startY: 20,
            head: [['#', ' ID', 'Model', 'Plate Number', 'Category', 'Price Per Km', 'Passengers Count', 'Image']],
            body: filteredData.map((item, index) => [
                index + 1,
                item.vehicleId,
                item.model,
                item.plateNumber,
                item.category,
                item.pricePerKm,
                item.passengersCount,
                item.image,
            ]),
        });
        doc.save('vehicle_table.pdf');

        pdfCsvSetAlertVisible(true);
        setTimeout(() => {
            pdfCsvSetAlertVisible(false);
        }, 3000);
    };

    const downloadCSV = () => {
        const csvData = Papa.unparse(
            filteredData.map((item, index) => ({
                '#': index + 1,
                ' ID': item.vehicleId,
                model: item.model,
                plateNumber: item.plateNumber,
                pricePerKm: item.pricePerKm,
                passengersCount: item.passengersCount,
                category: item.category,
                image: item.image,
            }))
        );
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'vehicle.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        pdfCsvSetAlertVisible(true);
        setTimeout(() => {
            pdfCsvSetAlertVisible(false);
        }, 3000);
    };

    //get all vehicle
    const getAllVehicles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle/allVehicales/with/category`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseData = await response.json();
            console.log("API Response:", responseData); // Debugging

            if (response.ok) {
                const mappedData = responseData.data.map((item) => ({
                    vehicleId: item.vehicleId,
                    model: item.model,
                    plateNumber: item.plateNumber,
                    category: item.category,
                    pricePerKm: item.pricePerKm,
                    passengersCount: item.passengerCount,
                    image: item.image,
                }));

                console.log("Mapped Data:", mappedData); // Debugging
                setFilteredData(mappedData);
            }
        } catch (error) {
            console.log("Fetch Error:", error);
        }
    };

    //save vehicle
    const saveVehicle = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("plateNumber", searchFilters.plateNumber);
        formData.append("passengerCount", searchFilters.passengersCount);
        formData.append("pricePerKm", searchFilters.pricePerKm);
        formData.append("vehicleModel", searchFilters.model);
        formData.append("status", searchFilters.status || "Available");
        formData.append("imageFile", searchFilters.image);
        formData.append("category", searchFilters.category);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                setTimeout(() => {
                    saveVehicleSetAlertVisible(false);
                    handleResetFilters();
                    getAllVehicles();
                }, 3000);

            } else {
                const errorData = await response.json();
                console.log("Error Response:", errorData);
                alert("Error Saving Vehicle: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            console.log("Error:", error);
            somethingError(true);
            setTimeout(() => {
                somethingError(false);
                handleResetFilters();
                getAllVehicles();
            }, 3000);

        }
    };

    //update vehicle
    const updateVehicle = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        const formData = new FormData();
        formData.append("vehicleId", searchFilters.vehicleId);
        formData.append("plateNumber", searchFilters.plateNumber);
        formData.append("passengerCount", searchFilters.passengersCount);
        formData.append("pricePerKm", searchFilters.pricePerKm);
        formData.append("vehicleModel", searchFilters.model);
        formData.append("status", searchFilters.status || "Available");
        formData.append("imageFile", searchFilters.image);
        formData.append("category", searchFilters.category);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {

            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                setTimeout(() => {
                    updateVehicleSetAlertVisible(false);
                    handleResetFilters();
                    getAllVehicles();
                }, 3000);

            } else {
                const errorData = await response.json();
                console.log("Error Response:", errorData);
                alert("Error Saving Vehicle: " + (errorData.message || "Unknown error"));
            }

        } catch (error) {
            console.log("Error:", error);
            somethingError(true);
            setTimeout(() => {
                somethingError(false);
                handleResetFilters();
                getAllVehicles();
            }, 3000);
        }
    };

    //delete vehicle
    const deleteVehicle = async () => {
        const id = searchFilters.vehicleId;
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/vehicle?vehicleId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if (response.ok) {
                setTimeout(() => {
                    deleteVehicleSetAlertVisible(false);
                    handleResetFilters();
                    getAllVehicles();
                }, 3000);
            }
        } catch (error) {
            console.log("Error:", error);
            somethingError(true);
            setTimeout(() => {
                somethingError(false);
                handleResetFilters();
                getAllVehicles();
            }, 3000);
        }
    }

    useEffect(() => {
        getAllVehicles();
    }, []);

    const [validationErrors, setValidationErrors] = useState({
        vehicleId: '',
        model: '',
        plateNumber: '',
        pricePerKm: '',
        passengersCount: '',
        category: '',
    });

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Validate Vehicle Model (No numbers, max 20 characters)
        if (!searchFilters.model) {
            errors.model = 'Vehicle model Name is required';
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(searchFilters.model)) {
            errors.model = 'Vehicle model cannot contain numbers';
            isValid = false;
        } else if (searchFilters.model.length > 20) {
            errors.model = 'Vehicle model must be at most 20 characters';
            isValid = false;
        }

        // Validate Plate Number (Exactly 3 letters, one "-", and up to 5 numbers)
        if (!searchFilters.plateNumber) {
            errors.plateNumber = 'Vehicle plate number is required';
            isValid = false;
        } else if (!/^[A-Za-z]{3}-\d{1,5}$/.test(searchFilters.plateNumber)) {
            errors.plateNumber = 'Vehicle plate number must be in format "XXX-12345" (3 letters, "-", up to 5 numbers)';
            isValid = false;
        }


        // Validate Price Per Km (Only numbers)
        if (!searchFilters.pricePerKm) {
            errors.pricePerKm = 'Price per km is required';
            isValid = false;
        } else if (!/^\d+(\.\d{1,2})?$/.test(searchFilters.pricePerKm)) {
            errors.pricePerKm = 'Price per km must be a valid number';
            isValid = false;
        }

        // Validate Passengers Count (Only numbers & <30)
        if (!searchFilters.passengersCount) {
            errors.passengersCount = 'Passengers count is required';
            isValid = false;
        } else if (!/^\d+$/.test(searchFilters.passengersCount)) {
            errors.passengersCount = 'Passengers count must be a number';
            isValid = false;
        } else if (parseInt(searchFilters.passengersCount, 10) >= 30) {
            errors.passengersCount = 'Passengers count must be less than 30';
            isValid = false;
        }


        if (!searchFilters.category) {
            errors.category = 'category is required';
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(searchFilters.category)) {
            errors.category = 'Vehicle category must be at most 20 characters';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };



    return (
        <div className='h-full w-full p-4 md:p-8 lg:p-12'>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {pdfAndCsvAlertVisible && (
                    <Alert
                        className='w-96 mb-5'
                        message="Saved"
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
                {error && (
                    <Alert
                        message="Error"
                        description="Something went wrong, try again"
                        type="error"
                        showIcon
                    />
                )}
            </div>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {saveVehicleAlertVisible && (
                    <Alert
                        className='w-96 mb-5'
                        message="Vehicle Saved"
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
                {updateVehicleAlertVisible && (
                    <Alert
                        className='w-96 mb-5'
                        message="Vehicle Updated"
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
                {deleteVehicleAlertVisible && (
                    <Alert
                        className='w-96 mb-5'
                        message="Vehicle Deleted"
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

            <Row>
                <Col className='h-auto w-full bg-white rounded-xl mb-4 shadow-lg flex flex-col p-2 animate__animated animate__backInDown'>
                    <form className="flex flex-col justify-center items-center h-auto w-full">
                        <div className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full'>
                            <TextField
                                id="vehicleId"
                                label="ID"
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
                                id="model"
                                label="Model"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.model}
                                onChange={handleInputChange}
                                error={!!validationErrors.model}
                                helperText={validationErrors.model}
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
                                id="plateNumber"
                                label="Plate Number"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.plateNumber}
                                onChange={handleInputChange}
                                error={!!validationErrors.plateNumber}
                                helperText={validationErrors.plateNumber}
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
                                id="pricePerKm"
                                label="Price Per Km"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.pricePerKm}
                                onChange={handleInputChange}
                                error={!!validationErrors.pricePerKm}
                                helperText={validationErrors.pricePerKm}
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
                                id="passengersCount"
                                label="Passengers Count"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.passengersCount}
                                onChange={handleInputChange}
                                error={!!validationErrors.passengersCount}
                                helperText={validationErrors.passengersCount}
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
                                id="category"
                                label="Category"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.category}
                                onChange={handleInputChange}
                                error={!!validationErrors.category}
                                helperText={validationErrors.category}
                                sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className='flex flex-row md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full'>
                            <TextField
                                id="image"
                                variant="outlined"
                                className='w-2/5'
                                onChange={handleImageChange}
                                type='file'
                                inputRef={fileInputRef}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <ImageIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div
                                className='h-16 w-20 rounded-full border-2 border-black'
                                style={{
                                    backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                            <button
                                type="button"
                                className="btn btn-primary dcButton"
                                style={{
                                    backgroundColor: '#0D3B66',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '20%',
                                }}
                                onClick={saveVehicle}
                                disabled={isRowSelected}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary dcButton"
                                style={{
                                    backgroundColor: '#008000',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '20%',
                                }}
                                onClick={updateVehicle}
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary dcButton"
                                style={{
                                    backgroundColor: '#C1121F',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '20%',
                                }}
                                onClick={deleteVehicle}
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </Col>
            </Row>
            <div className="justify-start items-start mb-4">
                <h3 className="text-lg font-normal text-sky-900">All Vehicles</h3>
            </div>
            <div className='justify-end flex items-center mb-4 flex gap-5 w-full animate__animated animate__backInRight'>
                <button
                    type="button"
                    className="btn btn-primary dcButton"
                    style={{
                        backgroundColor: '#0D3B66',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '10%',
                    }}
                    onClick={downloadPDF}
                >
                    Get PDF
                </button>
                <button
                    type="button"
                    className="btn btn-warning dcButton"
                    style={{
                        backgroundColor: '#FCA000',
                        color: '#0D3B66',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '10%',
                    }}
                    onClick={downloadCSV}
                >
                    Get CSV
                </button>
                <button
                    type="button"
                    className="btn btn-primary dcButton"
                    style={{
                        backgroundColor: '#008000',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '10%',
                    }}
                    onClick={handleResetFilters}
                >
                    Clear
                </button>
            </div>
            <Row>
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
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Model</th>
                                    <th className="border px-4 py-2">Plate Number</th>
                                    <th className="border px-4 py-2">Category</th>
                                    <th className="border px-4 py-2">Price Per Km</th>
                                    <th className="border px-4 py-2">Passengers Count</th>
                                    <th className="border px-4 py-2">Image</th>
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
                                        <td className="border px-4 py-2">{item.vehicleId}</td>
                                        <td className="border px-4 py-2">{item.model}</td>
                                        <td className="border px-4 py-2">{item.plateNumber}</td>
                                        <td className="border px-4 py-2">{item.category}</td>
                                        <td className="border px-4 py-2">{item.pricePerKm}</td>
                                        <td className="border px-4 py-2">{item.passengersCount}</td>
                                        <td className="border px-4 py-2">
                                            {item.image ? (
                                                <img
                                                    src={item.image.startsWith("data:image") ? item.image : `data:image/jpeg;base64,${item.image.trim()}`}
                                                    alt="Vehicle"
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                />
                                            ) : (
                                                <img
                                                    src="https://via.placeholder.com/50"
                                                    alt="Placeholder"
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                />
                                            )}
                                        </td>
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

export default Vehicle;