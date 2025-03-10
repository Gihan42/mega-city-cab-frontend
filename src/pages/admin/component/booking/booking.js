import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';
import './booking.css'
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

function Booking() {
  const [pdfAlertVisible, pdfSetAlertVisible] = useState(false);
  const [csvAlertVisible, csvSetAlertVisible] = useState(false);
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
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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
      (!searchFilters.bookingId || item.bookingId.toLowerCase().includes(searchFilters.bookingId.toLowerCase())) &&
      (!searchFilters.customerId || item.customer.toLowerCase().includes(searchFilters.customerId.toLowerCase())) &&
      (!searchFilters.driverId || item.driver.toLowerCase().includes(searchFilters.driverId.toLowerCase())) &&
      (!searchFilters.vehicleId || item.vehicle.toLowerCase().includes(searchFilters.vehicleId.toLowerCase())) &&
      (!searchFilters.status || item.status.toLowerCase().includes(searchFilters.status.toLowerCase())) &&
      (!searchFilters.bookingDate || new Date(item.date).toISOString().slice(0, 10) === searchFilters.bookingDate)
    );
  });

  const handleInputChange = (e) => {
    console.log(e.target.id, e.target.value);
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Booking Table', 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['#', 'Booking ID', 'Customer', 'Driver', 'Vehicle', 'Date', 'pick up location',
        'Destination', 'Total amount', 'Status']],
      body: filteredData.map((item, index) => [
        index + 1,
        item.bookingId,
        item.customer,
        item.driver,
        item.vehicle,
        item.date,
        item.pickUpLocation,
        item.destination,
        item.totalAmount,
        item.status
      ]),
    });
    doc.save('booking_table.pdf');

    pdfSetAlertVisible(true);


    setTimeout(() => {
      pdfSetAlertVisible(false);
    }, 3000);
  };
  const handleStatusChange = (e) => {
    setSearchFilters((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const downloadCSV = () => {
    const csvData = Papa.unparse(
      filteredData.map((item, index) => ({
        '#': index + 1,
        'Booking ID': item.bookingId,
        customerId: item.customer,
        driverId: item.driver,
        vehicleId: item.vehicle,
        bookingDate: item.date,
        pickUpLocation: item.pickUpLocation,
        destination: item.destination,
        totalAmount: item.totalAmount,
        status: item.status
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

    csvSetAlertVisible(true);
    setTimeout(() => {
      csvSetAlertVisible(false);
    }, 3000);
  };

  //get all booking details
  const getBookingDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/booking/bookingDetails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);

        const mappedData = responseData.data.map((item) => ({
          bookingId: `BID-${item.bookingId}`,
          customer: `${item.customerName}-${item.customerId}`,
          driver: `${item.driverName}-${item.driverId}`,
          vehicle: `${item.vehicleModel} - ${item.vehiclePlateNumber}`,
          date: item.bookingDate.split("T")[0],
          pickUpLocation: item.pickupLocation,
          destination: item.dropLocation,
          totalAmount: item.amount,
          status: item.status
        }));

        setFilteredData(mappedData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //update order status
  const handleUpdateClick = (bookingId) => {
    // Extract the booking number from the bookingId
    const bookingNumber = bookingId.split('BID-')[1];

    // Update the booking status by sending the bookingNumber as a query parameter
    const updateBookingStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACS_URL}/booking?bookingId=${bookingNumber}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const responseData = await response.json();

        if (response.ok) {
          console.log(responseData);
          getBookingDetails();
        }
      } catch (error) {
        console.log(error);
      }
    };

    updateBookingStatus(); // Call the function
  };



  useEffect(() => { getBookingDetails(); }, []);

  return (
    <div className="h-full w-full p-4 md:p-8 lg:p-12">
      <div className='flex justify-center items-center animate__animated animate__backInDown'>
        {pdfAlertVisible && (
          <Alert
            className='w-96 mb-5'
            message="PDF File Saved"
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
        {csvAlertVisible && (
          <Alert
            className='w-96 mb-5'
            message="CSV File Saved"
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
        <Col xs={24} sm={24} md={24} lg={24} className="bg-white rounded-xl mb-4 shadow-lg flex flex-col md:flex-row justify-center items-center p-2 h-auto animate__animated animate__backInDown">
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
              id="customerId"
              label="Search by Customer ID"
              variant="outlined"
              fullWidth
              value={searchFilters.customerId}
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
            <Select
              labelId="demo-simple-select-helper-label"
              id="status"
              label="Search by Status"
              fullWidth
              value={searchFilters.status}
              onChange={handleStatusChange}
              displayEmpty
              sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <MenuItem value="" disabled>
                Select Status
              </MenuItem>
              <MenuItem value={'Pending'}>Pending</MenuItem>
              <MenuItem value={'Confirmed'}>Close</MenuItem>
              <MenuItem value={'Booking not close'}>Booking not close</MenuItem>
            </Select>

          </form>
        </Col>
      </Row>

      <div className="justify-start items-start mb-4">
        <h3 className="text-lg font-normal text-sky-900">All Bookings</h3>
      </div>

      <div className='justify-end items-center mb-4 flex gap-5 w-full animate__animated animate__backInRight'>
        <button type="button" className="btn btn-primary dcButton"
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
        <button type="button" className="btn btn-warning dcButton"
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
        <button type="button" className="btn btn-warning dcButton"
          style={{
            id: 'dcButton',
            backgroundColor: '#008000',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            width: '13%',
          }}
          onClick={handleResetFilters}
        >
          get back
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
            <table className="table-auto w-full text-md text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Booking ID</th>
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Driver</th>
                  <th className="border px-4 py-2">Vehicle</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Pick Up Location</th>
                  <th className="border px-4 py-2">Destination</th>
                  <th className="border px-4 py-2">Total Amount</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2"></th>

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
                    <td className="border px-4 py-2">{item.customer}</td>
                    <td className="border px-4 py-2">{item.driver}</td>
                    <td className="border px-4 py-2">{item.vehicle}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.pickUpLocation}</td>
                    <td className="border px-4 py-2">{item.destination}</td>
                    <td className="border px-4 py-2">{item.totalAmount}</td>
                    <td className="border px-4 py-2">{item.status}</td>
                    <td className="border px-4 py-2">
                      {item.status === 'Booking not close' ? (
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{
                            backgroundColor: '#FF0000',
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleUpdateClick(item.bookingId)}
                        >
                          delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={item.status !== 'Pending'}
                          style={{
                            backgroundColor: item.status !== 'Pending' ? '#cccccc' : '#28a745',
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: item.status !== 'Pending' ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleUpdateClick(item.bookingId)}
                        >
                          update
                        </button>
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

export default Booking;