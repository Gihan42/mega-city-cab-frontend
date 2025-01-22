import React, { useState } from 'react';
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
  CarOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Booking from '../component/booking/booking';

const { Header, Sider, Content } = Layout;

function MainPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Dashboard'); 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: 'Dashboard', icon: <HomeOutlined style={{ fontSize: '24px' }} />, label: 'Dashboard' },
    { key: 'Bookings', icon: <CarryOutOutlined style={{ fontSize: '24px' }} />, label: 'Bookings' },
    { key: 'Customers', icon: <UserOutlined style={{ fontSize: '24px' }} />, label: 'Customers' },
    { key: 'Drivers', icon: <UserSwitchOutlined style={{ fontSize: '24px' }} />, label: 'Drivers' },
    { key: 'Vehicles', icon: <CarOutlined style={{ fontSize: '24px' }} />, label: 'Vehicles' },
    { key: 'Profile', icon: <ProfileOutlined style={{ fontSize: '24px' }} />, label: 'Profile' },
    { key: 'Report', icon: <LineChartOutlined style={{ fontSize: '24px' }} />, label: 'Report' },
    { key: 'log-out', icon: <LogoutOutlined style={{ fontSize: '24px' }} />, label: 'log out' },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Dashboard':
        return <div>Dashboard Content</div>;
      case 'Bookings':
        return <Booking />;
      case 'Customers':
        return <div>Customers Content</div>;
      case 'Drivers':
        return <div>Drivers Content</div>;
      case 'Vehicles':
        return <div>Vehicles Content</div>;
      case 'Profile':
        return <div>Profile Content</div>;
      case 'Report':
        return <div>Report Content</div>;
      case 'log-out':
        return <div>Logging Out...</div>;
      default:
        return <div>Welcome</div>;
    }
  };

  return (
    <div className="h-full w-full">
      <Layout className="h-screen w-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <div className="ml-1 mr-1 h-10 mt-4 mb-6 rounded-lg shadow-lg shadow-blue-500/50 bg-slate-700"></div>
          <Menu
            className="text-2xl custom-menu	"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['Dashboard']}
            items={menuItems}
            onClick={(e) => setSelectedMenu(e.key)} 
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '24px' }}/> : <MenuFoldOutlined style={{ fontSize: '24px' }}/>}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
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
