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
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

function Drivers() {
  const [pdfAndCsvAlertVisible, pdfCsvSetAlertVisible] = useState(false);
  const [error, somethingError] = useState(false);
  const [saveDriverAlertVisible, saveDriverSetAlertVisible] = useState(false);
  const [updateDriverAlertVisible, updateDriverSetAlertVisible] = useState(false);
  const [deleteDriverAlertVisible, deleteDriverSetAlertVisible] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    driverId: '',
    driverName: '',
    driverAge: '',
    driverEmail: '',
    driverLicenseNumber: '',
    driverNicNumber: '',
    driverContact: '',
    driverAddress: ''
  });
  const [data, setFilteredData] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      driverId: `DID-${index + 1}`,
      driverName: `Driver ${index + 1}`,
      driverAge: `${index + 1}`,
      driverEmail: `DeMAIL ${index + 1}`,
      driverLicenseNumber: `DL ${index + 1}`,
      driverNicNumber: `DN ${index + 1}`,
      driverContact: `DC ${index + 1}`,
      driverAddress: `DA ${index + 1}`
    }))
  );
  // const [data] = useState(
  //   Array.from({ length: 20 }).map((_, index) => ({
  //     driverId: `DID-${index + 1}`,
  //     driverName: `Driver ${index + 1}`,
  //     driverAge: `${index + 1}`,
  //     driverEmail: `DeMAIL ${index + 1}`,
  //     driverLicenseNumber: `DL ${index + 1}`,
  //     driverNicNumber: `DN ${index + 1}`,
  //     driverContact: `DC ${index + 1}`,
  //     driverAddress: `DA ${index + 1}`
  //   }))
  // );
  const handleResetFilters = () => {
    setSearchFilters({
      driverId: '',
      driverName: '',
      driverAge: '',
      driverEmail: '',
      driverLicenseNumber: '',
      driverNicNumber: '',
      driverContact: '',
      driverAddress: ''
    });
    setIsRowSelected(false);
    setFilteredData(data);
  };
  const filteredData = data.filter((item) => {
    return (
      (!searchFilters.driverId || item.driverId.toLowerCase().includes(searchFilters.driverId.toLowerCase())) &&
      (!searchFilters.driverName || item.driverName.toLowerCase().includes(searchFilters.driverName.toLowerCase())) &&
      (!searchFilters.driverAge || item.driverAge.toString().includes(searchFilters.driverAge.toString())) &&
      (!searchFilters.driverEmail || item.driverEmail.toLowerCase().includes(searchFilters.driverEmail.toLowerCase())) &&
      (!searchFilters.driverLicenseNumber || item.driverLicenseNumber.toLowerCase().includes(searchFilters.driverLicenseNumber.toLowerCase())) &&
      (!searchFilters.driverNicNumber || item.driverNicNumber.toLowerCase().includes(searchFilters.driverNicNumber.toLowerCase())) &&
      (!searchFilters.driverContact || item.driverContact.toLowerCase().includes(searchFilters.driverContact.toLowerCase())) &&
      (!searchFilters.driverAddress || item.driverAddress.toLowerCase().includes(searchFilters.driverAddress.toLowerCase()))

    );
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [id]: '',
    }));
  }
  const handleRowClick = (item) => {
    setSearchFilters({
      driverId: item.driverId,
      driverName: item.driverName,
      driverAge: item.driverAge,
      driverEmail: item.driverEmail,
      driverLicenseNumber: item.driverLicenseNumber,
      driverNicNumber: item.driverNicNumber,
      driverContact: item.driverContact,
      driverAddress: item.driverAddress

    });
    setIsRowSelected(true);
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('driver Table', 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['#', ' ID', 'Name', 'Age', 'Email', 'Licenece Number	', 'Nic Number	', 'Contact	', 'Address']],
      body: filteredData.map((item, index) => [
        index + 1,
        item.driverId,
        item.driverName,
        item.driverAge,
        item.driverEmail,
        item.driverLicenseNumber,
        item.driverNicNumber,
        item.driverContact,
        item.driverAddress
      ]),
    });
    doc.save('driver_table.pdf');

    pdfCsvSetAlertVisible(true);


    setTimeout(() => {
      pdfCsvSetAlertVisible(false);
    }, 3000);
  };

  const downloadCSV = () => {
    const csvData = Papa.unparse(
      filteredData.map((item, index) => ({
        '#': index + 1,
        ' ID': item.driverId,
        driverName: item.driverName,
        driverAge: item.driverAge,
        driverEmail: item.driverEmail,
        driverLicenseNumber: item.driverLicenseNumber,
        driverNicNumber: item.driverNicNumber,
        driverContact: item.driverContact,
        driverAddress: item.driverAddress
      }))
    )
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'driver.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    pdfCsvSetAlertVisible(true);
    setTimeout(() => {
      pdfCsvSetAlertVisible(false);
    }, 3000);
  };

  //get all drivers
  const getAllDrivers = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver/allDrivers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData.data)
        const mappedData = responseData.data.map((item) => ({
          driverId: `D-${item.driverId}`,
          driverName: item.name,
          driverAge: item.age,
          driverEmail: item.email,
          driverLicenseNumber: item.licenseNumber,
          driverNicNumber: item.nic,
          driverContact: item.contactNumber,
          driverAddress: item.address,
          driverStatus: item.status
        }))
        setFilteredData(mappedData);
      }

    } catch (error) {
      console.log(error)
    }
  };

  // save driver
  const saveDriver = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const driverRequest = {
      name: searchFilters.driverName,
      age: searchFilters.driverAge,
      email: searchFilters.driverEmail,
      licenseNumber: searchFilters.driverLicenseNumber,
      contactNumber: searchFilters.driverContact,
      nic: searchFilters.driverNicNumber,
      address: searchFilters.driverAddress,
      status: "Available",
    }
    try{
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(driverRequest),
    })
    if(response.ok){
      saveDriverSetAlertVisible(true);
      setTimeout(() => {
        saveDriverSetAlertVisible(false);
        handleResetFilters();
        getAllDrivers();
      }, 3000);
    }
    }catch(error){console.log(error)
      somethingError(true);
      setTimeout(() => {
        somethingError(false);
        handleResetFilters();
        getAllDrivers();
      }, 3000);
    }
    
  };

  // update driver
  const updateDriver = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const dId=searchFilters.driverId.split('D-')[1];
    const driverRequest = {
      driverId:dId ,
      name: searchFilters.driverName,
      age: searchFilters.driverAge,
      email: searchFilters.driverEmail,
      licenseNumber: searchFilters.driverLicenseNumber,
      contactNumber: searchFilters.driverContact,
      nic: searchFilters.driverNicNumber,
      address: searchFilters.driverAddress,
      status: "Available",
    }
    try{
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(driverRequest),
    })
    if(response.ok){
      updateDriverSetAlertVisible(true);
      setTimeout(() => {
        updateDriverSetAlertVisible(false);
        handleResetFilters();
        getAllDrivers();
      }, 3000);
    }
    }catch(error){console.log(error)
      somethingError(true);
      setTimeout(() => {
        somethingError(false);
        handleResetFilters();
        getAllDrivers();
      }, 3000);
    }
  };

  //delete driver
  const deleteDriver = async () => {
    const dId=searchFilters.driverId.split('D-')[1];
    try{
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/driver?driverId=${dId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    if(response.ok){
      deleteDriverSetAlertVisible(true);
      setTimeout(() => {
        deleteDriverSetAlertVisible(false);
        handleResetFilters();
        getAllDrivers();
      }, 3000);
    }
    }catch(error){console.log(error)
      somethingError(true);
      setTimeout(() => {
        somethingError(false);
        handleResetFilters();
        getAllDrivers();
      }, 3000);
    }
  }

  useEffect(() => { getAllDrivers(); }, []);

  const [validationErrors, setValidationErrors] = useState({
    driverName: '',
    driverAge: '',
    driverEmail: '',
    driverLicenseNumber: '',
    driverNicNumber: '',
    driverContact: '',
    driverAddress: ''
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;
  
    // Validate Driver Name (No numbers & max length 20)
    if (!searchFilters.driverName) {
      errors.driverName = 'Driver Name is required';
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(searchFilters.driverName)) {
      errors.driverName = 'Driver Name cannot contain numbers';
      isValid = false;
    } else if (searchFilters.driverName.length > 20) {
      errors.driverName = 'Driver Name must be at most 20 characters';
      isValid = false;
    }
  
    // Validate Driver Age (Only numbers & <75)
    if (!searchFilters.driverAge) {
      errors.driverAge = 'Driver Age is required';
      isValid = false;
    } else if (!/^\d+$/.test(searchFilters.driverAge)) {
      errors.driverAge = 'Driver Age must be a number';
      isValid = false;
    } else if (parseInt(searchFilters.driverAge, 10) >= 75) {
      errors.driverAge = 'Driver Age must be less than 75';
      isValid = false;
    }
  
    // Validate Driver Email
    if (!searchFilters.driverEmail) {
      errors.driverEmail = 'Driver Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(searchFilters.driverEmail)) {
      errors.driverEmail = 'Driver Email is invalid';
      isValid = false;
    }
  
    // Validate Driver License Number (Only 10 characters)
    if (!searchFilters.driverLicenseNumber) {
      errors.driverLicenseNumber = 'License Number is required';
      isValid = false;
    } else if (!/^[A-Za-z0-9]{10}$/.test(searchFilters.driverLicenseNumber)) {
      errors.driverLicenseNumber = 'License Number must be exactly 10 characters';
      isValid = false;
    }
  
    // Validate NIC (11 numbers or 11 numbers + "V")
    if (!searchFilters.driverNicNumber) {
      errors.driverNicNumber = 'NIC Number is required';
      isValid = false;
    } 
  
    // Validate Contact Number (Exactly 10 digits & must start with specific prefixes)
    if (!searchFilters.driverContact) {
      errors.driverContact = 'Contact Number is required';
      isValid = false;
    } else if (!/^(077|076|078|072|075|074|071)\d{7}$/.test(searchFilters.driverContact)) {
      errors.driverContact = 'Contact Number must be 10 digits and start with 077, 076, 078, 072, 075, 074, or 071';
      isValid = false;
    }
  
    // Validate Address
    if (!searchFilters.driverAddress) {
      errors.driverAddress = 'Address is required';
      isValid = false;
    }
  
    setValidationErrors(errors);
    return isValid;
  };
  

  return (
    <div className='h-full w-full p-4 md:p-8 lg:p-12'>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
              {saveDriverAlertVisible && (
                <Alert
                  className='w-96 mb-5'
                  message="Driver Saved"
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
              {updateDriverAlertVisible && (
                <Alert
                  className='w-96 mb-5'
                  message="Driver Updated"
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
              {deleteDriverAlertVisible && (
                <Alert
                  className='w-96 mb-5'
                  message="Driver Deleted"
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
      <Row>
        <Col className=' h-auto w-full bg-white rounded-xl mb-4 shadow-lg flex flex-col p-2 animate__animated animate__backInDown'>
          <form className="flex flex-col  justify-center items-center  h-auto w-full">
            <div className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full '>
              <TextField
                id="driverId"
                label=" Driver ID"
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
                id="driverName"
                label=" Driver Name"
                variant="outlined"
                fullWidth
                value={searchFilters.driverName}
                onChange={handleInputChange}
                error={!!validationErrors.driverName}
                helperText={validationErrors.driverName}
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
                id="driverAge"
                label=" Driver Age"
                variant="outlined"
                fullWidth
                value={searchFilters.driverAge}
                onChange={handleInputChange}
                error={!!validationErrors.driverAge}
                helperText={validationErrors.driverAge}
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
                id="driverEmail"
                label=" Driver Email"
                variant="outlined"
                fullWidth
                value={searchFilters.driverEmail}
                onChange={handleInputChange}
                error={!!validationErrors.driverEmail}
                helperText={validationErrors.driverEmail}
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
                id="driverLicenseNumber"
                label="  License Number"
                variant="outlined"
                fullWidth
                value={searchFilters.driverLicenseNumber}
                error={!!validationErrors.driverLicenseNumber}
                helperText={validationErrors.driverLicenseNumber}
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
                id="driverNicNumber"
                label="  Nic Number"
                variant="outlined"
                fullWidth
                value={searchFilters.driverNicNumber}
                onChange={handleInputChange}
                error={!!validationErrors.driverNicNumber}
                helperText={validationErrors.driverNicNumber}
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
            <div className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full'>
              <TextField
                id="driverContact"
                label="Contact Number"
                variant="outlined"
                fullWidth
                value={searchFilters.driverContact}
                onChange={handleInputChange}
                error={!!validationErrors.driverContact}
                helperText={validationErrors.driverContact}
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
                id="driverAddress"
                label="Address"
                variant="outlined"
                fullWidth
                value={searchFilters.driverAddress}
                onChange={handleInputChange}
                error={!!validationErrors.driverAddress}
                helperText={validationErrors.driverAddress}
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
                  backgroundColor: '#0D3B66',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '80%',
                }}
                onClick={saveDriver}
                disabled={isRowSelected}
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
                  width: '80%',
                }}
                onClick={updateDriver}
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
                  width: '80%',
                }}
                onClick={deleteDriver}
              >
                delete
              </button>
              <button type="button" className="btn btn-primary dcButton"
                style={{
                  id: 'dcButton',
                  backgroundColor: '#FCA000',
                  color: '#0D3B66',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '80%',
                }}
                onClick={handleResetFilters}
              >
                clear
              </button>
            </div>
          </form>
        </Col>
      </Row>

      <div className="justify-start items-start mb-4">
        <h3 className="text-lg font-normal text-sky-900">All Drivers</h3>
      </div>
      <div className='justify-start items-center mb-4 flex gap-5 w-full animate__animated animate__backInRight'>
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
      </div>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} className="flex h-full justify-center items-center p-2 h-full animate__animated animate__backInUp">
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
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Age</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Licenece Number</th>
                  <th className="border px-4 py-2">Nic Number</th>
                  <th className="border px-4 py-2">Contact </th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Status</th>

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
                    <td className="border px-4 py-2">{item.driverId}</td>
                    <td className="border px-4 py-2">{item.driverName}</td>
                    <td className="border px-4 py-2">{item.driverAge}</td>
                    <td className="border px-4 py-2">{item.driverEmail}</td>
                    <td className="border px-4 py-2">{item.driverLicenseNumber}</td>
                    <td className="border px-4 py-2">{item.driverNicNumber}</td>
                    <td className="border px-4 py-2">{item.driverContact}</td>
                    <td className="border px-4 py-2">{item.driverAddress}</td>
                    <td className="border px-4 py-2">available</td>
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

export default Drivers