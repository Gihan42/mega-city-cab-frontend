import React from 'react';
import image1 from '../../../../assets/pexels-kanishkaranasinghe-4169723.jpg';
import image2 from '../../../../assets/Screenshot 2025-01-25 135159.png';
import image3 from '../../../../assets/matt-dany-9UgWdunl__U-unsplash.jpg';
import Navbar from '../navbar/navbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Logo from '../../../../assets/Mega_City_Cab_Logo.jpg';
import TextField from '@mui/material/TextField';

function Home() {
  return (
    <div className="relative w-full h-screen">
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
            <div className="absolute top-1/2  transform -translate-x-1/2 -translate-y-1/2
             text-white flex text-8xl font-bold  ms-[20%]">

<Card sx={{ width: 400, maxWidth: '100%',padding:'2%' }}>  {/* Adjust the width of the entire card */}
  <CardMedia
    sx={{
      height: 250,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    image={Logo}
    title="Mega City Cab"
  />
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      add a comment
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 445, width: '100%',}}>
    <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          sx={{
            color: 'text.secondary',
            maxWidth: 445,
            width: '100%',
          }}
        />

    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Share</Button>
    <Button size="small">Learn More</Button>
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex text-8xl font-bold">
             
             <h1 className='text-sky-900 text-6xl'>
             Mega Ci
             </h1>
            <h1 className='text-sky-900 text-6xl'>
            ty Cab
            </h1>
   
            </div>
          </div>
          <div className="carousel-item h-full">
            <img
              src={image3}
              className="d-block w-full h-full object-cover"
              alt="Slide 3"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
              Mega City Cab
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
