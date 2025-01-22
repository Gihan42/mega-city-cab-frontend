import * as React from 'react';
import './login.css';
import Box from '@mui/material/Box';
import LogingComponent from '../singupandlogin/logincomponent/logingComponent';
import SingupComponent from '../singupandlogin/singincomponent/singupComponent';
import loggingImage from '../../assets/loginImage.png'

function Loging() {
  const [activeTab, setActiveTab] = React.useState('login');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (

    <div className="flex bg-blue-100 items-center justify-center h-screen w-screen  p-10">
      <div className=' h-4/5	w-3/5	bg-white grid grid-cols-2 gap-4 rounded-2xl shadow-lg '>

        <div className="col  flex justify-center items-center ">
          {/* First column content */}
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <h4 className='flex justify-center items-center mb-4'>welcome again !</h4>
            <div className="button-group mb-4 gap-2 flex justify-center items-center">
              <button
                className={`btn btn-lg pl-4 pr-4 ${activeTab === 'login' ? 'btn-primary' : 'btn-outline'} toogleBtn`}
                onClick={() => handleTabChange('login')}
                style={{
                  marginTop: '1rem',
                  backgroundColor: activeTab === 'login' ? '#0D3B66' : '', 
                  color: activeTab === 'login' ? '#fff' : '', 
                  padding: '10px 20px',
                  borderRadius: '15px',
                  border:activeTab === 'login' ? '' : '1px solid #0D3B66',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Login
              </button>

              <button
                className={`btn btn-lg pl-4 pr-4 ${activeTab === 'signup' ? 'btn-primary' : 'btn-outline'} toogleBtn`}
                onClick={() => handleTabChange('signup')}
                style={{
                  marginTop: '1rem',
                  backgroundColor: activeTab === 'signup' ? '#0D3B66' : '', 
                  color: activeTab === 'signup' ? '#fff' : '', 
                  padding: '10px 20px',
                  borderRadius: '15px',
                  border: activeTab === 'signup' ? '#0D3B66' : '',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'login' && (
              <div className="tab-content flex justify-center items-center">
                <LogingComponent />
              </div>
            )}
            {activeTab === 'signup' && 
            <div className="tab-content flex justify-center items-center">
              <SingupComponent/>
              </div>}
          </Box>

        </div>

        <div className="col flex items-center justify-start rounded-xl"
              style={{
                backgroundImage: `url(${loggingImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
        >
          
        </div>
      </div>
    </div>

  );
}

export default Loging;



