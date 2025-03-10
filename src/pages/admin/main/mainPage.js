import React, { useState, useEffect } from 'react';
import './mainPage.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  CarryOutOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  ProfileOutlined,
  LineChartOutlined,
  CarOutlined,
  CommentOutlined,
  MailOutlined
} from '@ant-design/icons';

import { Button, Layout, Menu, theme } from 'antd';
import Booking from '../component/booking/booking';
import DashBoard from "../component/dashboard/dashboard";
import Customer from '../component/customers/customer';
import NotSupported from '../component/notspported/notsupported';
import Drivers from '../component/drivers/drivers';
import Vehicle from '../component/vehicles/vehicle';
import AdminPrfoile from '../component/profile/adminPrfoile';
import Income from '../component/report/income';
import Comments from '../component/comments/comments';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Badge, Avatar, Space } from "antd";
const { Header, Sider, Content } = Layout;

function MainPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [isScreenSupported, setIsScreenSupported] = useState(true);
  const [adminName,setAdminName]=useState('');
  const navigate = useNavigate();
  const [bookingsCount,setBookingCount] = useState('');;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const getAdminName = () =>{
    const name =localStorage.getItem('name');
    setAdminName(name);
  }

  useEffect(() => {
    getAdminName();
    getPendingBookingCount();
    const checkScreenSize = () => {
      setIsScreenSupported(window.innerWidth > 1030);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getPendingBookingCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/booking/pending/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
        const text = await response.text();
      if (!text) return setBookingCount(0);
  
      const responseData = JSON.parse(text);
      setBookingCount(responseData.data || 0);
    } catch (error) {
      console.error("Error fetching pending booking count:", error);
      setBookingCount(0);
    }
  };
  
  const checkMail = () => {
    const email = localStorage.getItem('email');
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      alert("No email found in localStorage!");
    }
  };


  const menuItems = [
    { key: 'Dashboard', icon: <HomeOutlined style={{ fontSize: '24px' }} />, label: 'Dashboard' },
    {
      key: "Bookings",
      icon: <CarryOutOutlined style={{ fontSize: "24px"}} />,
      label: (
        <span>
          <Badge count={bookingsCount} offset={[10, 0]} style={{ backgroundColor: "#f5222d",marginTop:"5px"}}>
          <span style={{ color: "white",fontSize: "24px" }}>Bookings</span>
          </Badge>
        </span>
      ),
    },
    { key: 'Customers', icon: <UserOutlined style={{ fontSize: '24px' }} />, label: 'Customers' },
    { key: 'Drivers', icon: <UserSwitchOutlined style={{ fontSize: '24px' }} />, label: 'Drivers' },
    { key: 'Vehicles', icon: <CarOutlined style={{ fontSize: '24px' }} />, label: 'Vehicles' },
    { key: 'Profile', icon: <ProfileOutlined style={{ fontSize: '24px' }} />, label: 'Profile' },
    { key: 'Income', icon: <LineChartOutlined style={{ fontSize: '24px' }} />, label: 'Income' },
    { key: 'Comments', icon: <CommentOutlined  style={{ fontSize: '24px' }} />, label: 'Comments' },
    { key: 'log-out', icon: <LogoutOutlined style={{ fontSize: '24px' }} />, label: 'log out' },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Dashboard':
        return <DashBoard />;
      case 'Bookings':
        return <Booking />;
      case 'Customers':
        return <Customer />;
      case 'Drivers':
        return <Drivers/>;
      case 'Vehicles':
        return <Vehicle/>;
      case 'Profile':
        return <AdminPrfoile/>;
      case 'Income':
        return <Income/>;
      case 'Comments':
        return <Comments/>;
        case 'log-out':
          handleLogout();
          return null; 
      default:
        return <div>Welcome</div>;
    }
  };

  if (!isScreenSupported) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <NotSupported />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.setItem('token', '');
    localStorage.setItem('email', '');
    localStorage.setItem('role', '');
    localStorage.setItem('id', '');
    localStorage.setItem('name', '');
    navigate('/');
  }
  return (
    <div className="h-full w-full overflow-hidden">

      <Layout className="h-screen w-screen">

        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <div className="ml-1 mr-1 h-10 mt-4 mb-6 rounded-lg shadow-lg shadow-blue-500/50 bg-slate-700"></div>
          <Menu
            className="text-2xl custom-menu"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['Dashboard']}
            items={menuItems}
            onClick={(e) => setSelectedMenu(e.key)}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} className='flex'>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '24px' }} /> : <MenuFoldOutlined style={{ fontSize: '24px' }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />

                  <div className='w-full  flex justify-end items-center pr-4 '>
                      <div className='mr-8  bg-sky-950 hover:bg-sky-800 hover:cursor-pointer w-56 flex justify-center items-center gap-2 rounded-xl  shadow-lg p-2 text-lg'
                       onClick={checkMail}
                       >
                      <MailOutlined style={{ fontSize: '30px',color: '#fff' }} />
                      <h1 className='text-lg font-bold text-white mt-2 hover:cursor-pointer'>check your mails</h1>
                        </div>
                        <div className=' bg-sky-950 w-36 flex justify-center items-center gap-2 rounded-xl  shadow-lg p-2 text-lg'>
                          <AccountCircleIcon fontSize="large" sx={{ color: '#fff' }}/>
                          <h1 className='text-lg font-bold text-white mt-2'>{adminName}</h1>
                        </div>
                  </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </Content>

        </Layout>
      </Layout>
    </div>
  );
}

export default MainPage;