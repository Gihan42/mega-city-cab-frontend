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
            showCursor: false ,
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
                    <source src={Video} type="video/mp4"/>
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
        </div>

    );
}

export default Home;