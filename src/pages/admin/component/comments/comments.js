import React, { use, useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'animate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { Alert, Button, Space } from 'antd';

function Comments() {

    const [pdfAndCsvAlertVisible, pdfCsvSetAlertVisible] = useState(false);
    const [error, somethingError] = useState(false);
    const [deleteCommentAlertVisible, deleteCommentSetAlertVisible] = useState(false);


    const [searchFilters, setSearchFilters] = useState({
        commentId: '',
        customerId: '',
        customerName: '',
        comment: '',
        commentDate: '',
    });
    const [data, setFilteredData] = useState(
        Array.from({ length: 20 }).map((_, index) => ({
            commentId: `CMID-${index + 1}`,
            customerId: `CUS ${index + 1}`,
            customerName: `CUSTOMER${index + 1}`,
            comment: `ABC ${index + 1}`,
            commentDate: new Date().toISOString().slice(0, 10),
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
            commentId: '',
            customerId: '',
            customerName: '',
            comment: '',
            commentDate: '',
        });

        setFilteredData(data);
    };
    const filteredData = data.filter((item) => {
        return (
            (!searchFilters.commentId || item.commentId.toString().includes(searchFilters.commentId.toString())) &&
            (!searchFilters.customerId || item.customerId.toString().includes(searchFilters.customerId.toString())) &&
            (!searchFilters.customerName || item.customerName.toLowerCase().includes(searchFilters.customerName.toLowerCase())) &&
            (!searchFilters.comment || item.comment.toLowerCase().includes(searchFilters.comment.toLowerCase())) &&
            (!searchFilters.commentDate ||
                (item.commentDate && !isNaN(new Date(item.commentDate)) &&
                    new Date(item.commentDate).toISOString().slice(0, 10) === searchFilters.commentDate))
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
            commentId: item.commentId,
            customerId: item.customerId,
            customerName: item.customerName,
            comment: item.comment,
            commentDate: item.commentDate

        });
    };
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('comment Table', 14, 10);
        doc.autoTable({
            startY: 20,
            head: [['#', ' ID', 'customer id', 'customer name', 'comment', 'date']],
            body: filteredData.map((item, index) => [
                index + 1,
                item.commentId,
                item.customerId,
                item.customerName,
                item.comment,
                item.commentDate
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
                ' ID': item.commentId,
                customerId: item.customerId,
                customerName: item.customerName,
                comment: item.comment,
                commentDate: item.commentDate.split("T")[0]
            }))
        )
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'comment.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        pdfCsvSetAlertVisible(true);
        setTimeout(() => {
            pdfCsvSetAlertVisible(false);
        }, 3000);
    };

    // get all comments
    const getComments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/comment/allComments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            const responseData = await response.json();
            if (response.ok) {
                console.log(data);
                const mappedData = responseData.data.map((item) => {
                    const dateValue = item.date;
                    const parsedDate = dateValue ? new Date(dateValue) : null;

                    return {
                        commentId: item.commentId,
                        customerId: item.userId,
                        customerName: item.userName,
                        comment: item.comment,
                        commentDate: parsedDate instanceof Date && !isNaN(parsedDate)
                            ? parsedDate.toISOString().split("T")[0]
                            : "Invalid Date",

                    };
                });

                console.log("Mapped Data:", mappedData);
                setFilteredData(mappedData);


            }
        } catch (error) {
            console.log(error);
        }
    };

    //delete comment
    const deleteComment = async () => {
        const id = searchFilters.commentId
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/comment?commentId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if(response.ok){
                deleteCommentSetAlertVisible(true)
                setTimeout(() => {
                    deleteCommentSetAlertVisible(false);
                    handleResetFilters();
                    getComments();
                  }, 3000);
            }

        } catch (error) {
            console.log(error)
            somethingError(true);
            setTimeout(() => {
              somethingError(false);
              handleResetFilters();
              getComments();
            }, 3000);
        }
    }
    useEffect(() => {
        getComments();
    }, []);


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
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {deleteCommentAlertVisible && (
                    <Alert
                        className='w-96 mb-5'
                        message="Comment Deleted"
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
                <Col
                    className=' h-auto w-full bg-white rounded-xl mb-4 shadow-lg flex flex-col p-2 animate__animated animate__backInDown'>
                    <form className="flex flex-col  justify-center items-center  h-auto w-full">
                        <div
                            className='flex flex-col md:flex-row justify-center items-center p-2 h-auto gap-4 md:gap-20 w-full '>
                            <TextField
                                id="commentId"
                                label=" Comment ID"
                                variant="outlined"
                                fullWidth
                                value={searchFilters.commentId}
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
                                label=" Customer Id"
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
                                id="customerName"
                                label=" customer Name"
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
                                id="commentDate"
                                variant="outlined"
                                type={'date'}
                                fullWidth
                                value={searchFilters.commentDate}
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
                                    backgroundColor: '#FCA000',
                                    color: '#0D3B66',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '80%',
                                    marginBottom: '1rem',
                                }}
                                onClick={handleResetFilters}
                            >
                                clear
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
                                    marginBottom: '1rem',
                                }}  onClick={deleteComment}
                                   >
                                delete
                            </button>
                        </div>
                    </form>
                </Col>
            </Row>
            <div className="justify-start items-start mb-4">
                <h3 className="text-lg font-normal text-sky-900">All Comments</h3>
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
                                    <th className="border px-4 py-2">Customer Id</th>
                                    <th className="border px-4 py-2">Customer Name</th>
                                    <th className="border px-4 py-2">Comment</th>
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
                                        <td className="border px-4 py-2">{item.commentId}</td>
                                        <td className="border px-4 py-2">{item.customerId}</td>
                                        <td className="border px-4 py-2">{item.customerName}</td>
                                        <td className="border px-4 py-2">{item.comment}</td>
                                        <td className="border px-4 py-2">{item.commentDate}</td>



                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>

        </div>
    );
};

export default Comments;