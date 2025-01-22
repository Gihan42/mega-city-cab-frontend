import * as React from 'react';
import './login.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


function Loging() {
  const [activeTab, setActiveTab] = React.useState('login');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (

    <div className="flex bg-blue-100 items-center justify-center h-screen w-screen rounded-lg p-10">
      <div className='p-2 rounded-lg h-3/5	w-3/5	bg-white grid grid-cols-2 gap-4'>
        <div className="col border-2 border-black flex justify-center items-center ">
          {/* First column content */}
          <Box sx={{ width: '100%', typography: 'body1' }}>

            <div className="button-group mb-4 gap-2 flex justify-center items-center">
              <button
                className={`btn  btn-lg pl-4 pr-4 ${activeTab === 'login' ? 'btn-primary' : 'btn-outline'} toogleBtn`}
                onClick={() => handleTabChange('login')}
              >
                Login
              </button>
              <button
                className={`btn btn-lg pl-4 pr-4 ${activeTab === 'signup' ? 'btn-primary' : 'btn-outline'} toogleBtn`}
                onClick={() => handleTabChange('signup')}
              >
                Sign Up
              </button>
            </div>


            {activeTab === 'login' && <div className="tab-content flex justify-center items-center">Login Content</div>}
            {activeTab === 'signup' && <div className="tab-content flex justify-center items-center">Sign Up Content</div>}
          </Box>
        </div>

        <div className="col">
          {/* Second column content */}
          Column 2
        </div>
      </div>
    </div>

  );
}

export default Loging;



