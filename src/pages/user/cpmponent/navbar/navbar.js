import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Logo from '../../../../assets/Mega_City_Cab_Logo.jpg';
import './navBar.css'

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992); 
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-auto fixed top-0 left-0 z-50">
      <nav className="navbar navbar-expand-lg bg-transparent">
        <div className="container-fluid bg-transparent">
          <a className="navbar-brand" href="#"></a>
          <div className='w-12 h-12 border-1 ml-2 mt-1 border-black rounded-full absolute inset-0 bg-cover bg-center'
            style={{
              backgroundImage: `url(${Logo})`,
            }}></div>
          {!isMobile && (
            <div className='flex gap-4 justify-center text-sky-900 w-full bg-transparent'>
  <a className="navbar-brand navbar-links" href="#">Home</a>
  <a className="navbar-brand navbar-links" href="#">About Us</a>
  <a className="navbar-brand navbar-links" href="#">Booking</a>
  <a className="navbar-brand navbar-links" href="#">Profile</a>
</div>

          )}
          {isMobile && (
            <>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">About Us</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Booking</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Profile</a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
