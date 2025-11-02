import { ConfigProvider, Layout, theme } from 'antd';
import AppFooter from './components/Footer';
import { Hero } from './components/Hero';
import { TopBar } from './components/TopBar';
import { Features } from './components/Features';
import { FAQ } from './components/FAQ';
const {  Content } = Layout;

// Custom theme configuration
const customTheme = {
  token: {
    colorPrimary: '#ff6b00',
    colorSuccess: '#ff6b00',
    colorWarning: '#ff6b00',
    colorError: '#ff4d4f',
    colorInfo: '#ff6b00',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#000000',
    colorText: '#000000',
    colorTextSecondary: '#595959',
    colorBorder: '#d9d9d9',
    fontSize: 16,
    borderRadius: 8,
  },
  algorithm: theme.defaultAlgorithm,
};

const App = () => {
  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <TopBar />
        <Content>
          <Hero />
          <Features />
          <FAQ />
        </Content>
        <AppFooter />
      </Layout>
    </ConfigProvider>
  );
};

export default App;