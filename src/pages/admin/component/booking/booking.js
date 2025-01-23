import React, { useState } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';







function Booking() {
  const [searchFilters, setSearchFilters] = useState({
    bookingId: '',
    customerId: '',
    driverId: '',
    vehicleId: '',
    bookingDate: '',
  });

  const [data] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      bookingId: `BID-${index + 1}`,
      customer: `Customer ${index + 1}`,
      driver: `Driver ${index + 1}`,
      vehicle: `Vehicle ${index + 1}`,
      date: new Date().toISOString().slice(0, 10),
    }))
  );

  const filteredData = data.filter((item) => {
    return (
      (!searchFilters.bookingId || item.bookingId.toLowerCase().includes(searchFilters.bookingId.toLowerCase())) &&
      (!searchFilters.customerId || item.customer.toLowerCase().includes(searchFilters.customerId.toLowerCase())) &&
      (!searchFilters.driverId || item.driver.toLowerCase().includes(searchFilters.driverId.toLowerCase())) &&
      (!searchFilters.vehicleId || item.vehicle.toLowerCase().includes(searchFilters.vehicleId.toLowerCase())) &&
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
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Booking Table', 14, 10); // Title
    doc.autoTable({
      startY: 20,
      head: [['#', 'Booking ID', 'Customer', 'Driver', 'Vehicle', 'Date']],
      body: filteredData.map((item, index) => [
        index + 1,
        item.bookingId,
        item.customer,
        item.driver,
        item.vehicle,
        item.date,
      ]),
    });
    doc.save('booking_table.pdf');
  };
  
  // Function to download CSV
  const downloadCSV = () => {
    const csvData = Papa.unparse(
      filteredData.map((item, index) => ({
        '#': index + 1,
        'Booking ID': item.bookingId,
        Customer: item.customer,
        Driver: item.driver,
        Vehicle: item.vehicle,
        Date: item.date,
      }))
    );
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'booking_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full w-full justify-center item-center">
      <Row>
        <Col span={24} className="bg-white rounded-xl mb-4 shadow-lg flex justify-center item-center p-2 h-auto animate__animated animate__backInDown">
          <form className="flex justify-center item-center p-2 h-auto gap-20">
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
          </form>
        </Col>
      </Row>
      <div className="justify-start item-start">
        <h3 className="text-lg font-normal text-sky-900">All Bookings</h3>
      </div>
      <div className='justify-end item-end mb-2 flex gap-5'>
        <button type="button" className="btn btn-primary"
          style={{
            marginTop: '1rem',
            backgroundColor: '#0D3B66',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            width: '10%',
          }}onClick={downloadPDF}
        >get pdf</button>
        <button type="button" className="btn btn-warning"
          style={{
            marginTop: '1rem',
            backgroundColor: '#FCA000',
            color: '#0D3B66',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            width: '10%',
          }}onClick={downloadCSV}
        >get csv</button>

      </div>
      <Row>
        <Col span={24} className="flex justify-center item-center p-2 h-full animate__animated animate__backInUp">
          <div
            className="overflow-x-auto max-h-[500px] w-full border border-gray-300 rounded-lg"
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
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Driver</th>
                  <th className="border px-4 py-2">Vehicle</th>
                  <th className="border px-4 py-2">Date</th>
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
