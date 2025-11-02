import { Button, Typography, Space } from 'antd';
import { CalendarOutlined, FileTextOutlined, RocketOutlined, DatabaseOutlined, CloudOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import React from "react";
const { Title, Paragraph } = Typography;


// Animated Background Component
interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Word {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const AnimatedBackground: React.FC = () => {
  const [mousePos, setMousePos] = React.useState<MousePosition>({ x: 0, y: 0 });
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [words, setWords] = React.useState<Word[]>([]);
  
  const dimensions: string[] = ['temporal', 'contextual', 'behavioral', 'semantic'];

  React.useEffect(() => {
    // Initialize nodes
    const initialNodes = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    setNodes(initialNodes);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          let { x, y, vx, vy } = node;
          
          // Move away from cursor
          const dx = x - mousePos.x;
          const dy = y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            vx += (dx / dist) * force * 2;
            vy += (dy / dist) * force * 2;
          }
          
          // Update position
          x += vx;
          y += vy;
          
          // Boundaries
          if (x < 0 || x > window.innerWidth) vx *= -1;
          if (y < 0 || y > 400) vy *= -1;
          
          // Damping
          vx *= 0.95;
          vy *= 0.95;
          
          return { ...node, x, y, vx, vy };
        })
      );
    }, 30);
    
    return () => clearInterval(interval);
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    
    // Add floating word
    const word = dimensions[Math.floor(Math.random() * dimensions.length)];
    const newWord: Word = {
      id: Date.now(),
      text: word,
      x,
      y,
    };
    
    setWords(prev => [...prev, newWord]);
    
    // Remove word after animation
    setTimeout(() => {
      setWords(prev => prev.filter(w => w.id !== newWord.id));
    }, 1000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto',
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {/* Draw connections */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((otherNode, j) => {
            const dist = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );
            if (dist < 120) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={otherNode.x}
                  y2={otherNode.y}
                  stroke="rgba(255, 107, 0, 0.15)"
                  strokeWidth="1"
                />
              );
            }
            return null;
          })
        )}
        
        {/* Draw nodes */}
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="3"
            fill="rgba(255, 107, 0, 0.6)"
          />
        ))}
      </svg>
      
      {/* Floating words */}
      {words.map(word => (
        <motion.div
          key={word.id}
          initial={{ opacity: 1, y: word.y, x: word.x, scale: 0.5 }}
          animate={{ opacity: 0, y: word.y - 50, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            fontSize: '12px',
            color: '#ff6b00',
            fontWeight: 600,
            pointerEvents: 'none',
          }}
        >
          {word.text}
        </motion.div>
      ))}
    </div>
  );
};

// Hero Component
export const Hero: React.FC = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: '#000',
        padding: '120px 50px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px',
      }}
    >
      <AnimatedBackground />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Title level={1} style={{ color: '#fff', fontSize: '56px', marginBottom: '24px', fontWeight: 700 }}>
          AI-First Serverless Database
        </Title>
        <Paragraph style={{ 
          fontSize: '20px', 
          color: 'rgba(255,255,255,0.85)', 
          maxWidth: '700px', 
          margin: '0 auto 48px',
          lineHeight: '1.6'
        }}>
          Redefining retrieval for agents with temporal, contextual, and behavioral dimensions. Built on Cloudflare's edge network for millisecond latency.
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<CalendarOutlined />}
            style={{ 
              height: '50px', 
              fontSize: '16px',
              fontWeight: 600
            }}
            href="https://calendly.com" 
            target="_blank"
          >
            Talk to an Engineer
          </Button>
          <Button 
            size="large" 
            icon={<FileTextOutlined />}
            style={{ 
              height: '50px', 
              fontSize: '16px',
              background: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              fontWeight: 600
            }}
            href="https://araldhafeeri.github.io/MeridianDB/" 
            target="_blank"
          >
            Read the Docs
          </Button>
        </Space>
      </div>
    </motion.div>
  );
};
