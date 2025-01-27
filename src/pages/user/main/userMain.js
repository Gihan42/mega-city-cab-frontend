import React from 'react'
import Navbar from '../cpmponent/navbar/navbar'
import Home from '../cpmponent/home/home';
import AboutUs from '../cpmponent/aboutUs/aboutUs';
import Booking from "../cpmponent/booking/booking";
import Clients from "../cpmponent/comments/commentSection";
import  Footer from "../cpmponent/footer/footer"
import './userMain.css'

function UserMain() {
  return (
      <>
        <div className=' scrollable-container flex flex-col items-center justify-center w-full overflow-auto'>
          <Navbar/>
          <Home/>
          <AboutUs/>
          <Booking/>
          <Clients/>
        </div>
        <Footer/>
      </>

  )
}

export default UserMain