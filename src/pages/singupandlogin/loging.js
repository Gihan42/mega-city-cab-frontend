import * as React from 'react';
import './login.css';
import Box from '@mui/material/Box';
import LogingComponent from '../singupandlogin/logincomponent/logingComponent';
import SingupComponent from '../singupandlogin/singincomponent/singupComponent';
import loggingImage from '../../assets/loginImage.png';

function Loging() {
  const [activeTab, setActiveTab] = React.useState('login');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 p-4 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center">
      {/* Main container with responsive width */}
      <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-lg relative">
        {/* Mobile background - only visible on small screens */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center md:hidden"
          style={{
            backgroundImage: `url(${loggingImage})`,
          }}
        />
        
        <div className="flex flex-col md:flex-row w-full relative">
          {/* Form section with semi-transparent background on mobile */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 lg:p-8 bg-white/95 md:bg-white backdrop-blur-sm md:backdrop-blur-none">
            <Box className="w-full">
              <h4 className="text-xl md:text-2xl font-semibold text-center mb-6">
                welcome again !
              </h4>
              
              {/* Toggle buttons */}
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => handleTabChange('login')}
                  className={`px-6 py-2 rounded-xl font-bold transition-colors duration-200
                    ${activeTab === 'login'
                      ? 'bg-[#0D3B66] text-white'
                      : 'border border-[#0D3B66] text-[#0D3B66]'
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleTabChange('signup')}
                  className={`px-6 py-2 rounded-xl font-bold transition-colors duration-200
                    ${activeTab === 'signup'
                      ? 'bg-[#0D3B66] text-white'
                      : 'border border-[#0D3B66] text-[#0D3B66]'
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form components */}
              <div className="flex justify-center">
                {activeTab === 'login' ? <LogingComponent /> : <SingupComponent />}
              </div>
            </Box>
          </div>

          {/* Desktop image section - only visible on md and up */}
          <div className="hidden md:block md:w-1/2">
            <div 
              className="h-full min-h-[400px] w-full bg-cover bg-center rounded-r-xl"
              style={{
                backgroundImage: `url(${loggingImage})`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loging;