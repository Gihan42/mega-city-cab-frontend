import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';


function Customer() {
  const [pdfAlertVisible, pdfSetAlertVisible] = useState(false);
  const [csvAlertVisible, csvSetAlertVisible] = useState(false);
  const [data, setFilteredData] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      customerId: `CID-${index + 1}`,
      customerEmail: `Customer ${index + 1}`,
      customerName: `Customer ${index + 1}`,
      customerNic: `Customer ${index + 1}`,
      customerContact: `Customer ${index + 1}`,
      customerAddress: `Customer ${index + 1}`,
    }))
  );


  
  const handleResetFilters = () => {
    setSearchFilters({
      customerId: '',
      customerEmail: '',
      customerName: '',
      customerNic: '',
      customerContact: '',
    });
  
    setFilteredData(data); 
  };

  const [searchFilters, setSearchFilters] = useState({
    customerId: '',
    customerEmail: '',
    customerName: '',
    customerNic: '',
    customerContact: '',
  });

  
  const filteredData = data.filter((item) => {
    return (
      (!searchFilters.customerId || item.customerId.toLowerCase().includes(searchFilters.customerId.toLowerCase())) &&
      (!searchFilters.customerEmail || item.customerEmail.toLowerCase().includes(searchFilters.customerEmail.toLowerCase())) &&
      (!searchFilters.customerName || item.customerName.toLowerCase().includes(searchFilters.customerName.toLowerCase())) &&
      (!searchFilters.customerNic || item.customerNic.toLowerCase().includes(searchFilters.customerNic.toLowerCase())) &&
      (!searchFilters.customerContact || item.customerContact.toLowerCase().includes(searchFilters.customerContact.toLowerCase())) &&
      (!searchFilters.customerAddress || item.customerAddress.toLowerCase().includes(searchFilters.customerAddress.toLowerCase())) 

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
      customerId: item.customerId,
      customerEmail: item.customerEmail,
      customerName: item.customerName,
      customerNic: item.customerNic,
      customerContact: item.customerContact,
      customerAddress:item.customerAddress
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('customer Table', 14, 10); 
    doc.autoTable({
      startY: 20,
      head: [['#', ' ID', 'Email', 'Name', 'Nic', 'Contact','Address']],
      body: filteredData.map((item, index) => [
        index + 1,
        item.customerId,
        item.customerEmail,
        item.customerName,
        item.customerNic,
        item.customerContact,
        item.customerAddress,
      ]),
    });
    doc.save('customer_table.pdf');
      
        pdfSetAlertVisible(true);

   
        setTimeout(() => {
          pdfSetAlertVisible(false);
        }, 3000);
  };

  const downloadCSV = () => {
    const csvData = Papa.unparse(
      filteredData.map((item, index) => ({
        '#': index + 1,
        ' ID': item.customerId,
        customerEmail:item.customerEmail,
        customerName:item.customerName,
        customerNic:item.customerNic,
        customerContact:item.customerContact,
        customerAddress:item.customerAddress
      }))
    )
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cutomer_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    csvSetAlertVisible(true);
        setTimeout(() => {
          csvSetAlertVisible(false);
        }, 3000);
  };

  //get all customer 
  const getAllCustomer = async () => {
    try{
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user/allUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const responseData = await response.json();
        if (response.ok) {
          console.log("all users"+responseData.data);

         const mappedData = responseData.data.map((item) => ({
          customerId:`CUS-${item.id}`,
          customerEmail:item.email,
          customerName:item.username,
          customerNic:item.nic,
          customerContact:item.contactNumber,
          customerAddress:item.address


         })); 

          setFilteredData(mappedData);
        }

    }catch(error){
      console.log(error);
  }
};

// delete user
const deleteUser = async () => {

  const customerId = searchFilters.customerId.split('CUS-')[1];

  try{
    const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user?userId=${customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const responseData = await response.json();
      if (response.ok) {
        console.log("delete user"+responseData.data);
        alert("User Deleted Successfully");
        getAllCustomer();
      }

  }catch(error){
    alert("User Not Deleted ");
    console.log(error);
  }

};

useEffect(() => {
  getAllCustomer();
}, []);
  
  return (
    <div className='h-full w-full p-4 md:p-8 lg:p-12'>
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
          <form className="flex flex-col md:flex-row justify-center items-center pt-3 h-auto gap-4 md:gap-20 w-full">
            <TextField
              id="customerId"
              label="Search by  ID"
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
              id="customerEmail"
              label="Search by Eamil"
              variant="outlined"
              fullWidth
              value={searchFilters.customerEmail}
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
              id="customerName"
              label="Search by  Name"
              variant="outlined"
              fullWidth
              value={searchFilters.customerName}
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
              id="customerNic"
              label="Search by  Nic"
              variant="outlined"
              fullWidth
              value={searchFilters.customerNic}
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
              id="customerContact"
              label="Search by  Contact"
              variant="outlined"
              fullWidth
              value={searchFilters.customerContact}
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
            <button type="button" className="btn btn-primary dcButton"
              style={{
                id: 'dcButton',
                backgroundColor: '#C1121F',
                color: '#fff',
                padding: '16px 16px 16px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '1%',
                type: 'nutton'
              }} 
              
              onClick={deleteUser}>
              delete
            </button>

          </form>
        </Col>
        <div className="justify-start items-start mb-4">
          <h3 className="text-lg font-normal text-sky-900">All Customers</h3>
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
                  <th className="border px-4 py-2"> ID</th>
                  <th className="border px-4 py-2">Eamil</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Nic</th>
                  <th className="border px-4 py-2">Contact</th>
                  <th className="border px-4 py-2">Address</th>
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
                    <td className="border px-4 py-2">{item.customerId}</td>
                    <td className="border px-4 py-2">{item.customerEmail}</td>
                    <td className="border px-4 py-2">{item.customerName}</td>
                    <td className="border px-4 py-2">{item.customerNic}</td>
                    <td className="border px-4 py-2">{item.customerContact}</td>
                    <td className="border px-4 py-2">{item.customerAddress}</td>
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

export default Customer;