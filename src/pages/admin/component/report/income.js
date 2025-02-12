import React, { use, useState,useEffect } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

function Income() {
  const [pdfAlertVisible, pdfSetAlertVisible] = useState(false);
  const [csvAlertVisible, csvSetAlertVisible] = useState(false);
  const [data, setFilteredData] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      paymentId: `PID-${index + 1}`,
      bookingId: `BID ${index + 1}`,
      amount: `${index + 1}`,
      date: new Date().toISOString().slice(0, 10),
      method: `method ${index + 1}`,
      cutomer: `CID-${index + 1}- Cus${index + 1}`,
      vehicle: `VID-${index + 1}- Veh${index + 1}`,
      driver: `DID-${index + 1}- Veh${index + 1}`
    }))
  );
  const handleResetFilters = () => {
    setSearchFilters({
      paymentId: '',
      bookingId: '',
      amount: '',
      date: '',
      method: '',
      cutomer: '',
      vehicle: '',
      driver: ''
    });
    setFilteredData(data);
  };

  const [searchFilters, setSearchFilters] = useState({
    paymentId: '',
    bookingId: '',
    amount: '',
    date: '',
    method: '',
    cutomer: '',
    vehicle: '',
    driver: ''
  });

  const filteredData = data.filter((item) => {
    return (
      (!searchFilters.paymentId || item.paymentId.toString().includes(searchFilters.paymentId.toString())) &&
      (!searchFilters.bookingId || item.bookingId.toString().includes(searchFilters.bookingId.toString())) &&
      (!searchFilters.amount || item.amount.toLowerCase().includes(searchFilters.amount.toLowerCase())) &&
      (!searchFilters.date || item.date === searchFilters.date) &&
      (!searchFilters.method || item.method.toLowerCase().includes(searchFilters.method.toLowerCase())) &&
      (!searchFilters.cutomer || item.cutomer.toLowerCase().includes(searchFilters.cutomer.toLowerCase())) &&
      (!searchFilters.vehicle || item.vehicle.toLowerCase().includes(searchFilters.vehicle.toLowerCase())) &&
      (!searchFilters.driver || item.driver.toLowerCase().includes(searchFilters.driver.toLowerCase()))

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
      paymentId: item.paymentId,
      bookingId: item.bookingId,
      amount: item.amount,
      date: item.date,
      method: item.method,
      cutomer: item.cutomer,
      vehicle: item.vehicle,
      driver: item.driver,
    });
  };
  const handleStatusChange = (e) => {
    setSearchFilters((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Income Table', 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['#', 'Payment ID', 'Booking Id', 'Amount', 'Date', 'Method',
        'Customer', 'Vehicle', 'Driver']],
      body: filteredData.map((item, index) => [
        index + 1,
        item.paymentId,
        item.bookingId,
        item.amount,
        item.date,
        item.method,
        item.cutomer,
        item.vehicle,
        item.driver,
      ]),
    });
    doc.save('Income_table.pdf');

    pdfSetAlertVisible(true);


    setTimeout(() => {
      pdfSetAlertVisible(false);
    }, 3000);
  };
  const downloadCSV = () => {
    const csvData = Papa.unparse(
      filteredData.map((item, index) => ({
        '#': index + 1,
        'Payment ID': item.paymentId,
        bookingId: item.bookingId,
        amount: item.amount,
        date: item.date,
        method: item.method,
        cutomer: item.cutomer,
        vehicle: item.vehicle,
        driver: item.driver,
      }))
    )
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'income_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    csvSetAlertVisible(true);
    setTimeout(() => {
      csvSetAlertVisible(false);
    }, 3000);
  };
  //get all payment details
  const getPaymentDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/payment/allPayments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const responseData = await response.json()
      if (response.ok) {
        const mappedData = responseData.data.map((item) => ({
          paymentId:item.paymentId,
          bookingId:item.bookingId,
          amount:item.amount,
          date:item.date.split("T")[0],
          method:item.paymentMethod,
          cutomer:`${item.customerId}-${item.customerName}`,
          vehicle:`${item.vehicleId}-${item.vehicleModel}`,
          driver:`${item.driverId}-${item.driverName}`,
        }))
        setFilteredData(mappedData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getPaymentDetails();
  }, []);

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

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} className="bg-white rounded-xl mb-4 shadow-lg flex flex-col md:flex-row justify-center items-center p-2 h-auto animate__animated animate__backInDown">
          <form className="flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full">
            <TextField
              id="paymentId"
              label="Search by Payment ID"
              variant="outlined"
              fullWidth
              value={searchFilters.paymentId}
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
              id="date"
              variant="outlined"
              fullWidth
              type="date"
              value={searchFilters.date}
              onChange={handleInputChange}
              sx={{ marginBottom: '1rem', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <TextField
              id="cutomer"
              label="Search by Customer"
              variant="outlined"
              fullWidth
              value={searchFilters.cutomer}
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
              id="vehicle"
              label="Search by Vehicle"
              variant="outlined"
              fullWidth
              value={searchFilters.vehicle}
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
              id="driver"
              label="Search by Driver"
              variant="outlined"
              fullWidth
              value={searchFilters.driver}
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
          </form>
        </Col>
      </Row>

      <div className="justify-start items-start mb-4">
        <h3 className="text-lg font-normal text-sky-900">All Incomes</h3>
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
            <table className="table-auto w-full text-lg text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Payment ID</th>
                  <th className="border px-4 py-2">Booking ID</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Method</th>
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Vehicle</th>
                  <th className="border px-4 py-2">Driver</th>
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
                    <td className="border px-4 py-2">{item.paymentId}</td>
                    <td className="border px-4 py-2">{item.bookingId}</td>
                    <td className="border px-4 py-2">{item.amount}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.method}</td>
                    <td className="border px-4 py-2">{item.cutomer}</td>
                    <td className="border px-4 py-2">{item.vehicle}</td>
                    <td className="border px-4 py-2">{item.driver}</td>
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

export default Income