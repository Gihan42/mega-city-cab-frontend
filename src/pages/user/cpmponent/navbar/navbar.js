import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../../../../assets/Mega_City_Cab_Logo.jpg';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu visibility
  const navigate = useNavigate();

  // Handle screen resizing for mobile/desktop detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);

      // Close menu when switching from mobile to desktop
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
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

  function logOut() {
    localStorage.setItem('token', '');
    localStorage.setItem('email', '');
    localStorage.setItem('role', '');
    localStorage.setItem('id', '');
    localStorage.setItem('name', '');
    navigate('/');
  }

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle mobile menu item click (close menu when item clicked)
  const handleMobileItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full h-auto fixed top-0 left-0 z-50">
      <nav
        className={`navbar ${isScrolled ? 'bg-white' : 'bg-white'} transition-all`}
        style={{
          boxShadow: isScrolled ? '0 2px 2px -2px gray' : 'none',
        }}
      >
        <div className="container-fluid px-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <a className="navbar-brand" href="#">
              <div
                className="w-12 h-12 border-1 border-black rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${Logo})`,
                }}
              ></div>
            </a>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <div className="flex items-center justify-center gap-6 mx-auto">
                <ScrollLink
                  to="home"
                  smooth={true}
                  duration={500}
                  className="navbar-brand navbar-links text-[#FCA000] relative text-[#011c2f] hover:text-blue-500 cursor-pointer group"
                  style={{ fontSize: '20px', transition: 'color 0.3s' }}
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCA000] transition-all duration-300 group-hover:w-full"></span>
                </ScrollLink>
                <ScrollLink
                  to="aboutUs"
                  smooth={true}
                  duration={500}
                  className="navbar-brand navbar-links text-[#FCA000] relative text-[#011c2f] hover:text-blue-500 cursor-pointer group"
                  style={{ fontSize: '20px', transition: 'color 0.3s' }}
                >
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCA000] transition-all duration-300 group-hover:w-full"></span>
                </ScrollLink>
                <ScrollLink
                  to="booking"
                  smooth={true}
                  duration={500}
                  className="navbar-brand navbar-links text-[#FCA000] relative text-[#011c2f] hover:text-blue-500 cursor-pointer group"
                  style={{ fontSize: '20px', transition: 'color 0.3s' }}
                >
                  Booking
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCA000] transition-all duration-300 group-hover:w-full"></span>
                </ScrollLink>
                <ScrollLink
                  to="clients"
                  smooth={true}
                  duration={500}
                  className="navbar-brand navbar-links text-[#FCA000] relative text-[#011c2f] hover:text-blue-500 cursor-pointer group"
                  style={{ fontSize: '20px', transition: 'color 0.3s' }}
                >
                  Clients
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCA000] transition-all duration-300 group-hover:w-full"></span>
                </ScrollLink>
                <RouterLink
                  to="/profile"
                  className="navbar-brand navbar-links text-[#FCA000] relative text-[#011c2f] hover:text-blue-500 cursor-pointer group"
                  style={{ fontSize: '20px', transition: 'color 0.3s' }}
                >
                  Profile
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCA000] transition-all duration-300 group-hover:w-full"></span>
                </RouterLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                className="border-0 bg-transparent flex items-center"
                onClick={toggleMenu}
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            )}

            {/* Logout button */}
            <button
              className="btn"
              style={{
                backgroundColor: '#0D3B66',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={logOut}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu - Absolute positioned below the navbar */}
          {isMobile && isMenuOpen && (
            <div className="w-full bg-white mt-2 rounded shadow-lg absolute left-0 z-50 overflow-hidden transition-all duration-300">
              <ul className="list-none m-0 p-0">
                <li className="border-b border-gray-100">
                  <ScrollLink
                    className="navbar-brand navbar-links text-[#FCA000] block px-4 py-3 text-[#011c2f] hover:text-blue-500 hover:bg-gray-50 relative group"
                    to="home"
                    smooth={true}
                    duration={500}
                    onClick={handleMobileItemClick}
                  >
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </ScrollLink>
                </li>
                <li className="border-b border-gray-100">
                  <ScrollLink
                    className="navbar-brand navbar-links text-[#FCA000] block px-4 py-3 text-[#011c2f] hover:text-blue-500 hover:bg-gray-50 relative group"
                    to="aboutUs"
                    smooth={true}
                    duration={500}
                    onClick={handleMobileItemClick}
                  >
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </ScrollLink>
                </li>
                <li className="border-b border-gray-100">
                  <ScrollLink
                    className="navbar-brand navbar-links text-[#FCA000] block px-4 py-3 text-[#011c2f] hover:text-blue-500 hover:bg-gray-50 relative group"
                    to="booking"
                    smooth={true}
                    duration={500}
                    onClick={handleMobileItemClick}
                  >
                    Booking
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </ScrollLink>
                </li>
                <li className="border-b border-gray-100">
                  <ScrollLink
                    className="navbar-brand navbar-links text-[#FCA000] block px-4 py-3 text-[#011c2f] hover:text-blue-500 hover:bg-gray-50 relative group"
                    to="clients"
                    smooth={true}
                    duration={500}
                    onClick={handleMobileItemClick}
                  >
                    Clients
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </ScrollLink>
                </li>
                <li>
                  <RouterLink
                    className="navbar-brand navbar-links text-[#FCA000] block px-4 py-3 text-[#011c2f] hover:text-blue-500 hover:bg-gray-50 relative group"
                    to="/profile"
                    onClick={handleMobileItemClick}
                  >
                    Profile
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;