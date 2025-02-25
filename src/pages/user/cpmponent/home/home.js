import React, { useEffect, useRef } from 'react';
import image1 from '../../../../assets/pexels-kanishkaranasinghe-4169723.jpg';
import image2 from '../../../../assets/Screenshot 2025-01-25 135159.png';
import image3 from '../../../../assets/matt-dany-9UgWdunl__U-unsplash.jpg';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, TextField } from '@mui/material';
import Logo from '../../../..//assets/Mega_City_Cab_Logo.jpg';
import Typed from 'typed.js';
import 'animate.css';
import Video from '../../../../assets/video/5834557-uhd_3840_2160_24fps.mp4'

function Home() {


    const typedRef = useRef(null);

    useEffect(() => {
        const options = {
            strings: [
                'Welcome to Mega City Cab Service',
                'Get the best cab service in town',
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            showCursor: false,
            loop: true,
        };

        const typed = new Typed(typedRef.current, options);

        // Cleanup on component unmount
        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div className="container mx-auto mt-20 mb-4 px-4 py-8" id="home">
            {/* Video Container */}
            <div className="relative w-full md:w-3/4 lg:w-full  h-[600px] mx-auto rounded-lg overflow-hidden shadow-lg">
                {/* Video */}
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                >
                    <source src={Video} type="video/mp4" />
                </video>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Content on top of the video */}
                <div className="relative flex flex-col items-center justify-center h-full text-white text-center">
                    <h1
                        className="text-3xl font-bold"
                        ref={typedRef}
                    ></h1>
                </div>
            </div>

            {/* Services Section */}
            <section id="services" className="relative py-20 bg-slate-100 shadow-xl rounded-xl mt-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Our Services</h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "City Tours",
                                description: "Explore Colombo with our experienced drivers",
                                image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800&h=600",
                            },
                            {
                                title: "Airport Transfer",
                                description: "Reliable airport pickup and drop-off services",
                                image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&q=80&w=800&h=600",
                            },
                            {
                                title: "Long Distance",
                                description: "Comfortable inter-city travel services",
                                image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800&h=600",
                            },
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="relative h-72 overflow-hidden border-2 border-transparent">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                        <p className="text-gray-200">{service.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>

    );
}

export default Home;