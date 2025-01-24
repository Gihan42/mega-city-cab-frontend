import React, { useState } from 'react';
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


function Vehicle() {
    const [pdfAndCsvAlertVisible, pdfCsvSetAlertVisible] = useState(false);
    const [error, somethingError] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };
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
            vehicleId: `VID-${index + 1}`,
            model: `model- ${index + 1}`,
            plateNumber: `SP-${index + 1}`,
            pricePerKm: `KM ${index + 1}`,
            passengersCount: `Count- ${index + 1}`,
            category: `C- ${index + 1}`,
            image: defaultImage,
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

        setFilteredData(data);
    };
    const filteredData = data.filter((item) => {
        return (
            (!searchFilters.vehicleId || item.vehicleId.toLowerCase().includes(searchFilters.vehicleId.toLowerCase())) &&
            (!searchFilters.model || item.model.toLowerCase().includes(searchFilters.model.toLowerCase())) &&
            (!searchFilters.plateNumber || item.plateNumber.toLowerCase().includes(searchFilters.plateNumber.toLowerCase())) &&
            (!searchFilters.pricePerKm || item.pricePerKm.toLowerCase().includes(searchFilters.pricePerKm.toLowerCase())) &&
            (!searchFilters.passengersCount || item.passengersCount.toLowerCase().includes(searchFilters.passengersCount.toLowerCase())) &&
            (!searchFilters.category || item.category.toLowerCase().includes(searchFilters.category.toLowerCase())) &&
            (!searchFilters.image || item.image.toLowerCase().includes(searchFilters.image.toLowerCase()))
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
    };
      const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('customer Table', 14, 10); 
        doc.autoTable({
          startY: 20,
          head: [['#', ' ID', 'mODEL', 'Plate Number', 'Email', 'Ctegory','Price Per Km	','Passengers Count	','Image']],
          body: filteredData.map((item, index) => [
            index + 1,
            item.vehicleId,
            item.model,
             item.plateNumber,
            item.pricePerKm,
            item.passengersCount,
            item.category,
            item.image,
          ]),
        });
        doc.save('customer_table.pdf');
      
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
          )
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', 'booking_table.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      
          pdfCsvSetAlertVisible(true);
              setTimeout(() => {
                pdfCsvSetAlertVisible(false);
              }, 3000);
        };
    return (
        <div className='h-full w-full'>
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
                        description="somthing went wrong try again"
                        type="error"
                        showIcon
                    />
                )}
            </div>
            <Row style={{ height: '100%' }} className='bg-white rounded-xl    shadow-lg'>
                <Col span={8} className=' h-full p-2  animate__animated animate__backInLeft'>
                    <div className="justify-center items-center flex   w-full">
                        <h3 className="text-lg font-normal text-sky-900">Manage Vehicles</h3>
                    </div>
                    <div className='h-auto  flex justify-center item center'>
                        <form className='flex flex-col  justify-center items-center  h-auto w-full  '>
                            <TextField
                                id="vehicleId"
                                label=" ID"
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
                                label=" Model"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.model}
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
                                id="plateNumber"
                                label=" Plate Number"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.plateNumber}
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
<div className='flex justify-center items-center w-full gap-4 mb-4'>
            <TextField
                id="image"
                variant="outlined"
                fullWidth
                onChange={handleImageChange}
                type='file'
                sx={{
                    marginBottom: '0rem',
                    '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
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
                    backgroundImage: image ? `url(${image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </div>
                            <TextField
                                id="pricePerKm"
                                label=" Price Per Km"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.pricePerKm}
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
                                id="passengersCount"
                                label=" Passengers Count "
                                variant="outlined"
                                fullWidth
                                value={searchFilters.passengersCount}
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
                                id="category"
                                label=" Category "
                                variant="outlined"
                                fullWidth
                                value={searchFilters.category}
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
                            <div className='flex justify-center items-center w-full gap-4'>
                                <button type="button" className="btn btn-primary dcButton"
                                    style={{
                                        id: 'dcButton',
                                        backgroundColor: '#0D3B66',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        width: '20%',
                                    }}
                                    onClick={''}
                                >
                                    save
                                </button>
                                <button type="button" className="btn btn-primary dcButton"
                                    style={{
                                        id: 'dcButton',
                                        backgroundColor: '#008000',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        width: '20%',
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
                                        width: '20%',
                                    }}
                                    onClick={''}
                                >
                                    delete
                                </button>

                            </div>
                        </form>
                    </div>

                </Col>
                <Col
                    span={16}
                    className=" h-full pr-2 pl-2 pb-2 pt-20 animate__animated animate__backInRight"
                    style={{ height: '100%' }}
                >
                    <div className="w-full">
                        <h3 className="text-lg font-normal text-sky-900">All Vehicles</h3>
                    </div>
                    <div className="justify-end items-center mb-4 flex gap-5 w-full animate__animated animate__backInRight">
                    <button type="button" className="btn btn-primary dcButton"
                                    style={{
                                        id: 'dcButton',
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
                                    clear
                                </button>
                        <button
                            type="button"
                            className="btn btn-primary dcButton"
                            style={{
                                id: 'dcButton',
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
                            get pdf
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning dcButton"
                            style={{
                                id: 'dcButton',
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
                            get csv
                        </button>
                    </div>
                    <div
                        className=" overflow-x-auto table-container max-h-[450px] w-full  border-gray-300 rounded-lg"
                        style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#0D3B66 #E4E4E7',
                        }}
                    >
                        <table className="table-auto w-full  text-lg text-left border-collapse" >
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="border px-4 py-2">#</th>
                                    <th className="border px-4 py-2" >ID</th>
                                    <th className="border px-4 py-2" >Model</th>
                                    <th className="border px-4 py-2" >Plate Number</th>
                                    <th className="border px-4 py-2" >Category</th>
                                    <th className="border px-4 py-2" >Price Per Km</th>
                                    <th className="border px-4 py-2" >Passengers Count</th>
                                    <th className="border px-4 py-2" >Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : ''
                                            }`}
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
                                            <img
                                                src={item.image}
                                                alt="Vehicle"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>

            </Row>
        </div>
    )
}

export default Vehicle