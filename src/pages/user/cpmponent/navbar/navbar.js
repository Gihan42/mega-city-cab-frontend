import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import Logo from '../../../../assets/Mega_City_Cab_Logo.jpg';
import {useNavigate} from "react-router-dom";

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle screen resizing for mobile/desktop detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    handleResize(); // Initialize based on initial screen size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle scroll events to change navbar color and add bottom border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function logOut(){
    navigate('/');
  }

  return (
      <div className="w-full h-auto fixed top-0 left-0 z-50">
        <nav
            className={`navbar navbar-expand-lg ${isScrolled ? 'bg-white' : 'bg-white'} transition-all`}
            style={{
              boxShadow: isScrolled ? '0 2px 2px -2px gray' : 'none', // Optional: Add shadow when scrolled
            }}
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              {/* Logo */}
              <div
                  className="w-12 h-12 border-1 ml-2 mt-1 border-black rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${Logo})`,
                  }}
              ></div>
            </a>

            {/* Left side links */}
            {!isMobile && (
                <div className="flex gap-4 justify-center text-white w-full">
                  <Link style={{ color: '#011c2f', transition: 'color 0.3s',   fontSize: '20px' }} className="navbar-brand navbar-links text-[#FCA000] hover:text-blue-500 active:text-red-500 cursor-pointer" to="home" smooth={true} duration={500}>
                    Home
                  </Link>
                  <Link style={{ color: '#011c2f', transition: 'color 0.3s',  fontSize: '20px', }} className="navbar-brand navbar-links text-[#FCA000] hover:text-blue-500 active:text-red-500 cursor-pointer" to="aboutUs" smooth={true} duration={500}>
                    About Us
                  </Link>
                  <Link style={{ color: '#011c2f', transition: 'color 0.3s',  fontSize: '20px'}} className="navbar-brand navbar-links text-[#FCA000] hover:text-blue-500 active:text-red-500 cursor-pointer" to="booking" smooth={true} duration={500}>
                    Booking
                  </Link>
                  <Link style={{ color: '#011c2f', transition: 'color 0.3s',  fontSize: '20px' }} className="navbar-brand navbar-links text-[#FCA000] hover:text-blue-500 active:text-red-500 cursor-pointer" to="clients" smooth={true} duration={500}>
                    Clients
                  </Link>
                  <Link style={{ color: '#011c2f', transition: 'color 0.3s',  fontSize: '20px' }} className="navbar-brand navbar-links text-[#FCA000] hover:text-blue-500 active:text-red-500 cursor-pointer" href="#">
                    Profile
                  </Link>
                </div>
            )}

            {/* Mobile menu */}
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
                        <Link className="nav-link" to="home" smooth={true} duration={500}>
                          Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="aboutUs" smooth={true} duration={500}>
                          About Us
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="booking" smooth={true} duration={500}>
                          Booking
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="clients" smooth={true} duration={500}>
                          Clients
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link">Profile</Link>
                      </li>
                    </ul>
                  </div>
                </>
            )}

            {/* Logout button aligned to the right */}
            <div className="ml-auto">
              <button className="btn btn-danger" style={{
                backgroundColor: '#0D3B66',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
              }} onClick={logOut}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
  );
}

export default Navbar;
