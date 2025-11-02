import React from 'react';
import { Layout, Button, Typography, Space, Drawer } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import logo from "../assets/logo.png";

const { Header } = Layout;
const { Title } = Typography;

export const TopBar = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const menuItems = (
    <>
      <a 
        href="#features" 
        style={{ 
          color: '#000', 
          fontWeight: 500, 
          transition: 'color 0.3s',
          fontSize: isMobile ? '16px' : '14px',
          display: isMobile ? 'block' : 'inline',
          padding: isMobile ? '12px 0' : '0'
        }}
        onClick={isMobile ? closeDrawer : undefined}
      >
        Features
      </a>
      <a 
        href="#faq" 
        style={{ 
          color: '#000', 
          fontWeight: 500, 
          transition: 'color 0.3s',
          fontSize: isMobile ? '16px' : '14px',
          display: isMobile ? 'block' : 'inline',
          padding: isMobile ? '12px 0' : '0'
        }}
        onClick={isMobile ? closeDrawer : undefined}
      >
        FAQ
      </a>
      <Button 
        type="primary" 
        href="https://docs.meridiandb.com" 
        target="_blank"
        style={{
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '12px' : '0'
        }}
        onClick={isMobile ? closeDrawer : undefined}
      >
        Documentation
      </Button>
    </>
  );

  return (
    <Header style={{ 
      background: '#fff', 
      padding: isMobile ? '0 20px' : isTablet ? '0 30px' : '0 50px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0',
      height: isMobile ? '64px' : '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <img 
          width={isMobile ? "40" : "50"} 
          height={isMobile ? "40" : "50"} 
          src={logo} 
          alt="MeridianDB Logo"
        />
        <Title 
          level={isMobile ? 4 : 3} 
          style={{ 
            margin: 0, 
            color: '#000',
            fontSize: isMobile ? '18px' : isTablet ? '20px' : '24px'
          }}
        >
          MeridianDB
        </Title>
      </div>

      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            onClick={showDrawer}
            style={{ padding: '4px 8px' }}
          />
          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>Menu</span>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={closeDrawer}
                />
              </div>
            }
            placement="right"
            onClose={closeDrawer}
            open={drawerVisible}
            closable={false}
            width={280}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '8px'
            }}>
              {menuItems}
            </div>
          </Drawer>
        </>
      ) : (
        <Space size={isTablet ? "middle" : "large"}>
          {menuItems}
        </Space>
      )}
    </Header>
  );
};

export default TopBar;