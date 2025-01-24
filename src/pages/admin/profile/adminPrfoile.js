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
import PasswordChange from '../../passwordChange/passwordChange';


function AdminPrfoile() {

    const [pdfAndCsvAlertVisible, pdfCsvSetAlertVisible] = useState(false);
    const [error, somethingError] = useState(false);
      const [currentPassword, setCurrentPassword] = useState('');
      const [newPassword, setNewPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');

      const resetInputs = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      };
  
    
    const [searchFilters, setSearchFilters] = useState({
        adminId: '',
        adminName: '',
        adminEmail: '',
        adminNicNumber: '',
        adminContact: '',
        adminAddress: '',
    });
    const [data, setFilteredData] = useState(
        Array.from({ length: 20 }).map((_, index) => ({
            adminId: `AID-${index + 1}`,
            adminName: `Adimn ${index + 1}`,
            adminEmail: `AeMAIL ${index + 1}`,
            adminNicNumber: `ANIC ${index + 1}`,
            adminContact: `AC ${index + 1}`,
            adminAddress: `Aa ${index + 1}`
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
            adminId: '',
            adminName: '',
            adminEmail: '',
            adminNicNumber: '',
            adminContact: '',
            adminAddress: '',
        });

        setFilteredData(data);
    };
    const filteredData = data.filter((item) => {
        return (
            (!searchFilters.adminId || item.adminId.toLowerCase().includes(searchFilters.adminId.toLowerCase())) &&
            (!searchFilters.adminName || item.adminName.toLowerCase().includes(searchFilters.adminName.toLowerCase())) &&
            (!searchFilters.adminEmail || item.adminEmail.toLowerCase().includes(searchFilters.adminEmail.toLowerCase())) &&
            (!searchFilters.adminNicNumber || item.adminNicNumber.toLowerCase().includes(searchFilters.adminNicNumber.toLowerCase())) &&
            (!searchFilters.adminContact || item.adminContact.toLowerCase().includes(searchFilters.adminContact.toLowerCase())) &&
            (!searchFilters.adminAddress || item.adminAddress.toLowerCase().includes(searchFilters.adminAddress.toLowerCase()))

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
            adminId: item.adminId,
            adminName: item.adminName,
            adminEmail: item.adminEmail,
            adminNicNumber: item.adminNicNumber,
            adminContact: item.adminContact,
            adminAddress: item.adminAddress
        });
    };
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('members Table', 14, 10);
        doc.autoTable({
            startY: 20,
            head: [['#', ' ID', 'Name', 'Email', 'Nic Number	', 'Contact	', 'Address']],
            body: filteredData.map((item, index) => [
                index + 1,
                item.adminId,
                item.adminName,
                item.adminEmail,
                item.adminNicNumber,
                item.adminContact,
                item.adminAddress
            ]),
        });
        doc.save('admin_profile_table.pdf');

        pdfCsvSetAlertVisible(true);


        setTimeout(() => {
            pdfCsvSetAlertVisible(false);
        }, 3000);
    };

    const downloadCSV = () => {
        const csvData = Papa.unparse(
            filteredData.map((item, index) => ({
                '#': index + 1,
                ' ID': item.adminId,
                adminName: item.adminName,
                adminEmail: item.adminEmail,
                adminNicNumber: item.adminNicNumber,
                adminContact: item.adminContact,
                adminAddress: item.adminAddress
            }))
        )
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'members.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        pdfCsvSetAlertVisible(true);
        setTimeout(() => {
            pdfCsvSetAlertVisible(false);
        }, 3000);
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
                                id="adminId"
                                label=" Admin ID"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.adminId}
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
                                id="adminName"
                                label=" Admin Name"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.adminName}
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
                                id="adminEmail"
                                label=" Admin Email"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.adminEmail}
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
                                id="adminNicNumber"
                                label=" Admin Nic"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.adminNicNumber}
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
                                id="adminContact"
                                label=" Admin Contact"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.adminContact}
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

                        </div>
                        <div className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full'>
                            <TextField
                                id="adminAddress"
                                label=" Admin Address"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.adminAddress}
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
                                    backgroundColor: '#0D3B66',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '40%',
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
                                onClick={''}
                            >
                                delete
                            </button>
                            <button type="button" className="btn btn-primary dcButton" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                style={{
                                    id: 'dcButton',
                                    backgroundColor: '#FCA000',
                                    color: '#0D3B66',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '40%',
                                }}

                            >
                                change password
                            </button>

                        </div>
                    </form>
                </Col>
            </Row>
            {/* pop up */}
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header"> 
                            <h1 className="modal-title fs-5" id="exampleModalLabel" >Change Your Password</h1>
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
            <Row>
                <div className="justify-start items-start mb-4">
                    <h3 className="text-lg font-normal text-sky-900">All Members</h3>
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
                        get back
                    </button>
                </div>
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
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Nic </th>
                                    <th className="border px-4 py-2">Contact </th>
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
                                        <td className="border px-4 py-2">{item.adminId}</td>
                                        <td className="border px-4 py-2">{item.adminName}</td>
                                        <td className="border px-4 py-2">{item.adminEmail}</td>
                                        <td className="border px-4 py-2">{item.adminNicNumber}</td>
                                        <td className="border px-4 py-2">{item.adminContact}</td>
                                        <td className="border px-4 py-2">{item.adminAddress}</td>



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

export default AdminPrfoile