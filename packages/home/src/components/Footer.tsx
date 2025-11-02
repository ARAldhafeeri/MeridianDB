import { Typography, Layout } from 'antd';

const { Footer } = Layout;
const {  Paragraph } = Typography;

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center', background: '#000', color: '#fff', padding: '40px 50px' }}>
    <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
      MeridianDB © 2024 - AI-First Serverless Database | Built on Cloudflare Edge
    </Paragraph>
  </Footer>
  )
}
