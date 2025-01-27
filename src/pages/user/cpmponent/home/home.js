import React from 'react';
import image1 from '../../../../assets/pexels-kanishkaranasinghe-4169723.jpg';
import image2 from '../../../../assets/Screenshot 2025-01-25 135159.png';
import image3 from '../../../../assets/matt-dany-9UgWdunl__U-unsplash.jpg';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, TextField } from '@mui/material';
import Logo from '../../../..//assets/Mega_City_Cab_Logo.jpg';
import Footer from '../footer/footer'
import 'animate.css';

function Home() {
  return (
    <div className="relative w-full h-screen" id='home'>
      <Navbar />
      <div
        id="carouselExampleControlsNoTouching"
        className="carousel slide w-full h-full"
        data-bs-touch="false"
      >
        <div className="carousel-inner h-full">
          <div className="carousel-item active h-full">
            <img
              src={image1}
              className="d-block w-full h-full object-cover"
              alt="Slide 1"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            flex justify-start items-start sm:ml:12 md:ml-24 lg:ml-44 w-full px-4 sm:px-8 md:px-16 lg:px-24">
              <Card className="w-full max-w-md bg-white shadow-lg p-2 animate__animated animate__backInLeft rounded-xl  shadow-lg">
                <CardMedia
                  className="h-48 sm:h-60 md:h-72 lg:h-96 bg-cover bg-center "
                  image={Logo}
                  title="Mega City Cab"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Add a comment
                  </Typography>
                  <TextField
                    id="outlined-multiline-static"
                    label="Multiline"
                    multiline
                    rows={4}
                    className="w-full"
                  />
                </CardContent>
                <CardActions>
                  <button type="button" className="btn btn-primary dcButton"
                    style={{
                      id: 'dcButton',
                      backgroundColor: '#0D3B66',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    
                  >
                   add comment
                  </button>
                </CardActions>
              </Card>
            </div>
          </div>
          <div className="carousel-item h-full">
            <img
              src={image2}
              className="d-block w-full h-full object-cover"
              alt="Slide 2"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-end items-start w-full px-4 sm:px-8 md:px-16 lg:px-24">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            flex justify-start items-start sm:ml:12 md:ml-24 lg:ml-44 w-full px-4 sm:px-8 md:px-16 lg:px-24">
                <Card className="w-full max-w-md bg-white shadow-lg p-2 animate__animated animate__backInLeft rounded-xl  shadow-lg">
                  <CardMedia
                    className="h-48 sm:h-60 md:h-72 lg:h-96 bg-cover bg-center "
                    image={Logo}
                    title="Mega City Cab"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Add a comment
                    </Typography>
                    <TextField
                      id="outlined-multiline-static"
                      label="Multiline"
                      multiline
                      rows={4}
                      className="w-full"
                    />
                  </CardContent>
                  <CardActions>
                    <button type="button" className="btn btn-primary dcButton"
                      style={{
                        id: 'dcButton',
                        backgroundColor: '#0D3B66',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                     
                    >
                      comment
                    </button>
                  </CardActions>
                </Card>
              </div>
            </div>
          </div>
          <div className="carousel-item h-full">
            <img
              src={image3}
              className="d-block w-full h-full object-cover"
              alt="Slide 3"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-end items-start w-full px-4 sm:px-8 md:px-16 lg:px-24">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            flex justify-start items-start sm:ml:12 md:ml-24 lg:ml-44 w-full px-4 sm:px-8 md:px-16 lg:px-24">
                <Card className="w-full max-w-md bg-white shadow-lg p-2 animate__animated animate__backInLeft rounded-xl  shadow-lg">
                  <CardMedia
                    className="h-48 sm:h-60 md:h-72 lg:h-96 bg-cover bg-center "
                    image={Logo}
                    title="Mega City Cab"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Add a comment
                    </Typography>
                    <TextField
                      id="outlined-multiline-static"
                      label="Multiline"
                      multiline
                      rows={4}
                      className="w-full"
                    />
                  </CardContent>
                  <CardActions>
                    <button type="button" className="btn btn-primary dcButton"
                      style={{
                        id: 'dcButton',
                        backgroundColor: '#0D3B66',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                     
                    >
                      comment
                    </button>
                  </CardActions>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControlsNoTouching"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControlsNoTouching"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Home;