import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Space } from 'antd';
import LogoImage from '../../../../assets/Mega_City_Cab_Logo.jpg';
import ContactImage from '../../../../assets/5124556.jpg';
import 'animate.css';
import { LocalPhone, MarkEmailUnread, LinkedIn, Instagram, Facebook } from '@mui/icons-material';
import emailjs from 'emailjs-com';
import { Card, CardActions, CardContent, CardMedia, Typography, TextField } from '@mui/material';
import { MapPinIcon, ClockIcon, ShieldCheckIcon, StarIcon, CheckCircle2Icon, ArrowRightIcon } from "lucide-react";


function AboutUs() {
    const [success, setSuccess] = useState(false);
    const [saveCommentAlert, saveCommentSetAlert] = useState(false);
    const [error, somethingError] = useState(false);
    const [comment, setComment] = useState('');
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const updateDate = () => {
            setCurrentDate(new Date().toISOString().split('T')[0]);
        };

        updateDate();
        const interval = setInterval(updateDate, 1000);

        return () => clearInterval(interval);
    }, []);


    const clearContactFormTextFields = () => {
        ['name', 'phone', 'email', 'subject', 'message'].forEach(id => {
            document.getElementById(id).value = '';
        });
    };

    const handleSuccess = () => {
        const templateParams = {
            contact_name: document.getElementById('name').value,
            contact_phone: document.getElementById('phone').value,
            contact_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            contact_message: document.getElementById('message').value,
        };

        emailjs
            .send(
                'service_viwddtl',
                'template_4luvxxa',
                templateParams,
                'Ux3UVAjep_y4gWODo'
            )
            .then(
                () => {
                    setSuccess(true);
                    setTimeout(() => {
                        clearContactFormTextFields();
                        setSuccess(false);
                    }, 3000);
                },
                (err) => console.log('Failed to send message', err)
            );
    };
    const handleInputComment = (event) => {
        setComment(event.target.value);
    };

    // to day date



    //save comment
    const saveComment = async (event) => {
        event.preventDefault();
        const commentRequest = {
            comment: comment,
            userId: localStorage.getItem('id'),
            date: currentDate,
            status: '1'
        }
        console.log(commentRequest)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/comment/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(commentRequest)
            })
            const responseData = await response.json();
            if (response.ok) {
                console.log(responseData);
                saveCommentSetAlert(true)
                setTimeout(() => {
                    saveCommentSetAlert(false)
                    setComment('')
                }, 3000);
            }
        } catch (error) {
            somethingError(true)
            setTimeout(() => {
                somethingError(false)
                setComment('')
            }, 3000);
        }





    }




    return (
        <div className="container mx-auto px-4 py-8" id='aboutUs'>
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">About Us</h2>
                <div className="w-24 h-1 bg-[#FCA000] mx-auto"></div>
            </div>
            <div className='flex justify-center items-center animate__animated animate__backInDown'>
                {saveCommentAlert && (
                    <Alert
                        className='w-96 mb-5'
                        message="Commented"
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
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* About Section */}
                <div className="w-full lg:w-1/2 space-y-6 animate__animated animate__backInLeft">
                    <p className="text-base md:text-lg lg:text-2xl font-normal text-sky-900 text-justify">
                        Welcome to Mega City Cab, your trusted partner for reliable,
                        affordable, and convenient transportation services. We are
                        dedicated to ensuring a smooth and hassle-free travel experience
                        for all our customers. Whether you need a quick ride to work, a
                        comfortable journey to the airport, or a reliable option
                        for exploring the city, our fleet of well-maintained vehicles and
                        professional drivers is here to serve you. At Mega City Cab, we
                        prioritize safety, punctuality, and customer satisfaction, making
                        every ride with us a pleasant and memorable experience.
                    </p>
                    <button
                        type="button"
                        className="w-full md:w-1/2 bg-[#0D3B66] text-white py-3 px-6 rounded-lg hover:bg-sky-800 transition-colors"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        Contact Us
                    </button>
                </div>

                {/* comment Section */}
                {/* Container */}
                <div className="w-full lg:w-1/2 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex justify-center items-center p-4 animate__animated animate__backInRight">
                    {/* Card */}
                    <Card className="w-full max-w-sm md:max-w-md bg-white border-1 p-3 md:p-4 rounded-xl shadow-xl animate__animated animate__backInLeft">
                        {/* Card Image */}
                        <CardMedia
                            className="h-40 md:h-48 lg:h-52 rounded-lg transition-all duration-300 hover:opacity-90"
                            image={LogoImage}
                            title="Mega City Cab"
                            sx={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        {/* Card Content */}
                        <CardContent className="py-4">
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800"
                            >
                                Add a comment
                            </Typography>
                            <TextField
                                id="outlined-multiline-static"
                                label="Write your comment"
                                multiline
                                rows={3}
                                fullWidth
                                variant="outlined"
                                className="mt-2"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#0D3B66',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#0D3B66',
                                        },
                                    },
                                }}
                                value={comment}
                                onChange={handleInputComment}
                            />
                        </CardContent>

                        {/* Card Actions */}
                        <CardActions className="px-4 pb-4">
                            <button
                                type="button"
                                className="w-full bg-[#0D3B66] text-white py-2.5 md:py-3 px-4 md:px-6
                         rounded-lg text-sm md:text-base font-medium
                         transition-all duration-200
                         hover:bg-sky-800 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
                         disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={saveComment}
                            >
                                Add Comment
                            </button>
                        </CardActions>
                    </Card>
                </div>
                {/* Modal */}
                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog max-w-4xl w-full"
                        style={{
                            maxWidth: '800px',
                            width: '90%',
                        }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title text-xl font-semibold">Contact Us</h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={clearContactFormTextFields}
                                />
                            </div>
                            <div className="modal-body p-4">
                                <Row className="flex flex-col md:flex-row">
                                    {/* Contact Info Section */}
                                    <Col span={24} md={12} className="mb-6 md:mb-0">
                                        <div className="bg-white rounded-xl shadow-lg p-4 space-y-6">
                                            <div
                                                className="h-48 md:h-64 w-full bg-cover bg-center rounded-xl"
                                                style={{ backgroundImage: `url(${ContactImage})` }}
                                            />
                                            <div className="space-y-4">
                                                <h2 className="text-lg text-sky-900">Mega City Cab</h2>
                                                <div className="flex items-center gap-3">
                                                    <LocalPhone className="text-sky-900" />
                                                    <span className="text-sm md:text-base">
                                                        +11 95678935 - +11 95678934
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MarkEmailUnread className="text-sky-900" />
                                                    <span className="text-sm md:text-base">
                                                        id.megacity@gmail.com
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sky-900">find with me</p>
                                                    <div className="flex gap-4">
                                                        {[LinkedIn, Instagram, Facebook].map((Icon, index) => (
                                                            <Icon
                                                                key={index}
                                                                className="text-[#04517b]"
                                                                style={{ fontSize: '36px' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Contact Form Section */}
                                    <Col span={24} md={12} className="pl-0 md:pl-4">
                                        <div className="space-y-4">
                                            <h2 className="text-xl md:text-2xl text-sky-900 text-center">
                                                Send us a message
                                            </h2>
                                            {['name', 'phone', 'email', 'subject'].map((field) => (
                                                <input
                                                    key={field}
                                                    type="text"
                                                    id={field}
                                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none"
                                                />
                                            ))}
                                            <textarea
                                                id="message"
                                                placeholder="Message"
                                                className="w-full p-3 border-2 border-gray-300 rounded-xl h-32 focus:border-sky-500 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSuccess}
                                                className="w-full bg-[#0D3B66] text-white py-3 rounded-lg hover:bg-sky-800 transition-colors"
                                            >
                                                Send
                                            </button>
                                            {success && (
                                                <Alert
                                                    className="w-full"
                                                    message="Message Sent Successfully!"
                                                    type="success"
                                                    showIcon
                                                    action={<Button size="small" type="text">UNDO</Button>}
                                                    closable
                                                />
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* About Section with Parallax */}
            <section id="about" className="relative py-24 bg-fixed bg-cover bg-center mt-5" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070&h=1200')",
            }}>
                <div className="absolute inset-0  bg-sky-900/90"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold">Why Choose Us?</h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Professional Drivers",
                                        description: "Experienced and vetted drivers for your safety",
                                    },
                                    {
                                        title: "24/7 Service",
                                        description: "Available round the clock for your convenience",
                                    },
                                    {
                                        title: "Modern Fleet",
                                        description: "Well-maintained vehicles with latest amenities",
                                    },
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <CheckCircle2Icon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-xl">{feature.title}</h3>
                                            <p className="text-gray-300">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=400" alt="Service 1" className="rounded-lg shadow-2xl transform -rotate-3" />
                            <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=300&h=400" alt="Service 2" className="rounded-lg shadow-2xl transform translate-y-8 rotate-3" />            </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutUs;