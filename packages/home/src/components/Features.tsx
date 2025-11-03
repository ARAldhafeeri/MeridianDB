import React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { RocketOutlined, CloudOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const { Title, Paragraph } = Typography;

export const Features = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: isMobile ? '36px' : '48px', color: '#ff6b00' }} />,
      title: 'Multi-Dimensional Retrieval',
      description: 'Go beyond traditional RAG with semantic, temporal, contextual, and behavioral dimensions. Data decays over time with frequency weighting and factual tagging for intelligent memory management. With built-in active learning for behavioral signals on your agents memories.',
      asset: 'https://lottie.host/f6df1677-3cd2-415b-a654-5146e9c585da/EdJzCmCCBU.lottie'
    },
    {
      icon: <CloudOutlined style={{ fontSize: isMobile ? '36px' : '48px', color: '#ff6b00' }} />,
      title: 'Cloudflare-Native Scalability',
      description: 'Built on Cloudflare Workers, D1, Vectorize, and KV. Global low-latency access with automatic retries, failover, and event-driven processing. Cost-efficient and horizontally scalable. Your entire RAG run near where your users are.',
      asset: "https://lottie.host/a2462316-ea89-4465-9bec-4c851da0fd1a/kqR5qu5Tua.lottie"
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: isMobile ? '36px' : '48px', color: '#ff6b00' }} />,
      title: 'Integrated Consistency Model',
      description: 'Queue-based writes ensure eventual consistency without manual orchestration. Data is redundantly stored across Vector and D1 to preserve multidimensional context with SQL-based composite scoring for features and intelligent algrothims.',
      asset: 'https://lottie.host/45b366cf-998c-43fe-b1b8-926b314fb789/MgsPtuxhId.lottie'
    }
  ];

  return (
    <div 
      id="features" 
      style={{ 
        padding: isMobile ? '60px 20px' : isTablet ? '80px 40px' : '100px 50px', 
        background: '#fff' 
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Title 
          level={2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '40px' : isTablet ? '50px' : '60px', 
            fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px', 
            color: '#000',
            padding: isMobile ? '0 10px' : '0'
          }}
        >
          Core Features
        </Title>
      </motion.div>

      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: isMobile ? 0 : (index % 2 === 0 ? -50 : 50) }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.2 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '30px' : isTablet ? '40px' : '60px',
            marginBottom: isMobile ? '50px' : isTablet ? '60px' : '80px',
            flexDirection: isMobile ? 'column' : (index % 2 === 0 ? 'row' : 'row-reverse'),
            maxWidth: '1200px',
            margin: isMobile ? '0 auto 50px' : isTablet ? '0 auto 60px' : '0 auto 80px'
          }}
        >
          <div style={{ flex: 1, width: '100%' }}>
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
              {feature.icon}
            </div>
            <Title 
              level={3} 
              style={{ 
                marginBottom: isMobile ? '12px' : '16px', 
                color: '#000',
                fontSize: isMobile ? '20px' : isTablet ? '22px' : '24px'
              }}
            >
              {feature.title}
            </Title>
            <Paragraph 
              style={{ 
                fontSize: isMobile ? '14px' : '16px', 
                color: '#595959', 
                lineHeight: '1.8',
                marginBottom: isMobile ? '20px' : '0'
              }}
            >
              {feature.description}
            </Paragraph>
          </div>
          <div style={{ 
            flex: 1, 
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px'
          }}>
            <motion.div
              whileHover={{ scale: isMobile ? 1 : 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <DotLottieReact
                src={feature.asset}
                loop
                autoplay
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: isMobile ? '250px' : '400px'
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Features;