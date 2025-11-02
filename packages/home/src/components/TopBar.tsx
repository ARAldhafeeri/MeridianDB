import { Layout, Button, Typography, Space } from 'antd';
import logo from "../assets/logo.png";
const { Header } = Layout;
const { Title } = Typography;


export const TopBar = () => {
  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 50px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img width="50" height="50" src={logo} />
        <Title level={3} style={{ margin: 0, color: '#000' }}>MeridianDB</Title>
      </div>
      <Space size="large">
        <a href="#features" style={{ color: '#000', fontWeight: 500, transition: 'color 0.3s' }}>Features</a>
        <a href="#faq" style={{ color: '#000', fontWeight: 500, transition: 'color 0.3s' }}>FAQ</a>
        <Button type="primary" href="https://docs.meridiandb.com" target="_blank">
          Documentation
        </Button>
      </Space>
    </Header>
  );
};
