import React, { useState } from 'react';
import { Alert, Button, Col, Row } from 'antd';
import LogoImage from '../../../../assets/Mega_City_Cab_Logo.jpg';
import ContactImage from '../../../../assets/5124556.jpg';
import 'animate.css';
import { LocalPhone, MarkEmailUnread, LinkedIn, Instagram, Facebook } from '@mui/icons-material';
import emailjs from 'emailjs-com';

function AboutUs() {
    const [success, setSuccess] = useState(false);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* About Section */}
                <div className="w-full lg:w-1/2 space-y-6 animate__animated animate__backInLeft">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-sky-900">
                        About Us
                    </h1>
                    <hr className="border-t-4 border-black w-1/2" />
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

                {/* Logo Section */}
                <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[500px] animate__animated animate__backInRight">
                    <div
                        className="h-full w-full bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url(${LogoImage})` }}
                    />
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
        </div>
    );
}

export default AboutUs;