import React from 'react';
import { Typography, Collapse } from 'antd';
import { motion } from 'framer-motion';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export const FAQ = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [activeKey, setActiveKey] = React.useState<string | string[]>([]);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const faqs = [
    {
      question: 'What makes MeridianDB different from traditional RAG pipelines?',
      answer: 'MeridianDB goes beyond semantic search with temporal decay, contextual filtering, and behavioral learning. It helps agents avoid catastrophic forgetting by balancing stability and plasticity through multi-dimensional retrieval.'
    },
    {
      question: 'How does the eventual consistency model work?',
      answer: 'MeridianDB uses queue-based writes to ensure eventual consistency without manual orchestration. Data is redundantly stored across Vectorize and D1 to preserve multidimensional context, with automatic retries and failover mechanisms.'
    },
    {
      question: 'What are temporal and behavioral features?',
      answer: 'Temporal features track how memory decays over time with frequency weighting. Behavioral features track retrieval success rates to continuously improve agent performance. Both use configurable thresholds for active/passive learning phases.'
    },
    {
      question: 'Is MeridianDB suitable for production use?',
      answer: 'Yes! Built on Cloudflare\'s global network, MeridianDB provides millisecond latency, automatic scaling, and cost-efficient operations. It includes a complete SDK, operator UI, and comprehensive documentation for production deployments.'
    },
    {
      question: 'What are the main limitations?',
      answer: 'MeridianDB has eventual consistency (reads may lag slightly), requires developer-supplied context, needs periodic cleanup for temporal decay, and is optimized for the Cloudflare ecosystem. D1 has a 10GB storage limit.'
    }
  ];

  return (
    <div 
      id="faq" 
      style={{ 
        padding: isMobile ? '60px 20px' : isTablet ? '80px 40px' : '100px 50px', 
        background: '#000',
        maxWidth: '900px', 
        margin: '0 auto' 
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Title 
          level={2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '32px' : isTablet ? '40px' : '48px', 
            fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px', 
            color: '#fff',
            fontWeight: 700,
            padding: isMobile ? '0 10px' : '0'
          }}
        >
          Frequently Asked Questions
        </Title>
        <Collapse 
          accordion 
          bordered={false}
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
          expandIcon={({ isActive }) => 
            isActive ? 
            <MinusOutlined style={{ color: '#ff6b00', fontSize: '16px', fontWeight: 'bold' }} /> : 
            <PlusOutlined style={{ color: '#ff6b00', fontSize: '16px', fontWeight: 'bold' }} />
          }
          items={faqs.map((faq, index) => ({
            key: index.toString(),
            label: (
              <Text 
                strong 
                style={{ 
                  fontSize: isMobile ? '15px' : '16px', 
                  color: '#fff',
                  fontWeight: 600,
                  lineHeight: '1.6'
                }}
              >
                {faq.question}
              </Text>
            ),
            children: (
              <Paragraph 
                style={{ 
                  fontSize: isMobile ? '14px' : '15px', 
                  color: '#595959', 
                  marginBottom: 0,
                  lineHeight: '1.8',
                  paddingRight: isMobile ? '0' : '20px'
                }}
              >
                {faq.answer}
              </Paragraph>
            ),
            style: {
              marginBottom: '16px',
              background: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: '8px',
              overflow: 'hidden',
            },
            className: 'custom-collapse-item'
          }))}
        />
      </motion.div>
      
      <style>{`
        .custom-collapse-item .ant-collapse-header {
          padding: ${isMobile ? '16px' : '20px'} !important;
          background: #0a0a0a !important;
          border: none !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-collapse-item .ant-collapse-header:hover {
          background: #121212 !important;
        }
        
        .custom-collapse-item.ant-collapse-item-active .ant-collapse-header {
          background: #121212 !important;
          border-bottom: 1px solid #1a1a1a !important;
        }
        
        .custom-collapse-item .ant-collapse-content {
          background: #0a0a0a !important;
          border: none !important;
        }
        
        .custom-collapse-item .ant-collapse-content-box {
          padding: ${isMobile ? '16px' : '20px'} !important;
          padding-top: ${isMobile ? '12px' : '16px'} !important;
        }
        
        .ant-collapse-expand-icon {
          padding-inline-end: ${isMobile ? '12px' : '16px'} !important;
        }
      `}</style>
    </div>
  );
};

export default FAQ;