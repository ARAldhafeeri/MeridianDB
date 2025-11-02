import {  Typography } from 'antd';
import { motion } from 'framer-motion';
const { Title, Paragraph } = Typography;
import {  RocketOutlined, CloudOutlined, ThunderboltOutlined } from '@ant-design/icons';


export const Features = () => {
  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: '48px', color: '#ff6b00' }} />,
      title: 'Multi-Dimensional Retrieval',
      description: 'Go beyond traditional RAG with semantic, temporal, contextual, and behavioral dimensions. Data decays over time with frequency weighting and factual tagging for intelligent memory management.',
      image: 'https://via.placeholder.com/500x350/ff6b00/ffffff?text=Multi-Dimensional+Retrieval'
    },
    {
      icon: <CloudOutlined style={{ fontSize: '48px', color: '#ff6b00' }} />,
      title: 'Cloudflare-Native Scalability',
      description: 'Built on Cloudflare Workers, D1, Vectorize, and KV. Global low-latency access with automatic retries, failover, and event-driven processing. Cost-efficient and horizontally scalable.',
      image: 'https://via.placeholder.com/500x350/ff6b00/ffffff?text=Edge+Native+Performance'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '48px', color: '#ff6b00' }} />,
      title: 'Integrated Consistency Model',
      description: 'Queue-based writes ensure eventual consistency without manual orchestration. Data is redundantly stored across Vector and D1 to preserve multidimensional context with SQL-based composite scoring.',
      image: 'https://via.placeholder.com/500x350/ff6b00/ffffff?text=Consistency+Model'
    }
  ];

  return (
    <div id="features" style={{ padding: '100px 50px', background: '#fff' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', fontSize: '42px', color: '#000' }}>
          Core Features
        </Title>
      </motion.div>

      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            marginBottom: '80px',
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
            maxWidth: '1200px',
            margin: '0 auto 80px'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '24px' }}>{feature.icon}</div>
            <Title level={3} style={{ marginBottom: '16px', color: '#000' }}>{feature.title}</Title>
            <Paragraph style={{ fontSize: '16px', color: '#595959', lineHeight: '1.8' }}>
              {feature.description}
            </Paragraph>
          </div>
          <div style={{ flex: 1 }}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={feature.image}
              alt={feature.title}
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
