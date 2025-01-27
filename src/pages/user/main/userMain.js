import React from 'react'
import Navbar from '../cpmponent/navbar/navbar'
import Home from '../cpmponent/home/home';
import AboutUs from '../cpmponent/aboutUs/aboutUs';

function UserMain() {
  return (
    <div className='flex flex-col items-center justify-center w-full overflow-auto'>
      <Navbar/>
        <Home/>
        <AboutUs/>
    </div>
  )
}

export default UserMain