import { Typography, Collapse } from 'antd';
import { motion } from 'framer-motion';
const { Title, Paragraph, Text } = Typography;


export const FAQ = () => {
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
      answer: 'Temporal features track how memory decays over time with frequency weighting. Behavioral features track retrieval success rates to continuously improve agent performance. Both use configurable thresholds for active learning phases.'
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
    <div id="faq" style={{ padding: '100px 50px', background: '#f5f5f5', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px', fontSize: '42px', color: '#000' }}>
          Frequently Asked Questions
        </Title>
        <Collapse 
          accordion 
          bordered={false}
          style={{ background: '#fff' }}
          items={faqs.map((faq, index) => ({
            key: index,
            label: <Text strong style={{ fontSize: '16px', color: '#000' }}>{faq.question}</Text>,
            children: <Paragraph style={{ fontSize: '15px', color: '#595959', marginBottom: 0 }}>{faq.answer}</Paragraph>
          }))}
        />
      </motion.div>
    </div>
  );
};