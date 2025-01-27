import React from 'react'
import Navbar from '../cpmponent/navbar/navbar'
import Home from '../cpmponent/home/home';
import AboutUs from '../cpmponent/aboutUs/aboutUs';
import Booking from "../cpmponent/booking/booking";
import './userMain.css'

function UserMain() {
  return (
    <div className=' scrollable-container flex flex-col items-center justify-center w-full overflow-auto'>
      <Navbar/>
        <Home/>
        <AboutUs/>
    <Booking/>
    </div>
  )
}

export default UserMain