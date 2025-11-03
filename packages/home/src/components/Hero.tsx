import React from "react";
import { Button, Typography, Space } from 'antd';
import { CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

// Enhanced Animated Background with X-Formation and Multi-dimensional Cubes
interface Dimension {
  text: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

interface Cube {
  id: number;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  speed: number;
}

const AnimatedBackground: React.FC = () => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [cubes, setCubes] = React.useState<Cube[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  

  // Initialize cubes across entire background
  React.useEffect(() => {
    // Initialize floating cubes spanning full background
    const initialCubes: Cube[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * 600,
      z: Math.random() * 100,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      rotationZ: Math.random() * 360,
      speed: 0.3 + Math.random() * 0.7,
    }));
    setCubes(initialCubes);
  }, []);



  // Animate cubes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCubes(prev => prev.map(cube => ({
        ...cube,
        rotationX: (cube.rotationX + cube.speed) % 360,
        rotationY: (cube.rotationY + cube.speed * 0.7) % 360,
        rotationZ: (cube.rotationZ + cube.speed * 0.5) % 360,
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 3D Cubes representing multi-dimensional space */}
        {cubes.map(cube => {
          const size = 20 + cube.z * 0.2;
          const opacity = 0.3 + (cube.z / 100) * 0.4;
          
          return (
            <g key={cube.id} opacity={opacity}>
              {/* Front face */}
              <rect
                x={cube.x - size / 2}
                y={cube.y - size / 2}
                width={size}
                height={size}
                fill="none"
                stroke="#ff6b00"
                strokeWidth="1.5"
                transform={`rotate(${cube.rotationZ} ${cube.x} ${cube.y})`}
              />
              {/* Back face (offset for depth) */}
              <rect
                x={cube.x - size / 2 + 8}
                y={cube.y - size / 2 - 8}
                width={size}
                height={size}
                fill="none"
                stroke="#ff6b00"
                strokeWidth="1"
                opacity="0.5"
                transform={`rotate(${cube.rotationZ} ${cube.x + 8} ${cube.y - 8})`}
              />
              {/* Connecting lines for 3D effect */}
              <line x1={cube.x - size/2} y1={cube.y - size/2} x2={cube.x - size/2 + 8} y2={cube.y - size/2 - 8} stroke="#ff6b00" strokeWidth="1" opacity="0.5" />
              <line x1={cube.x + size/2} y1={cube.y - size/2} x2={cube.x + size/2 + 8} y2={cube.y - size/2 - 8} stroke="#ff6b00" strokeWidth="1" opacity="0.5" />
            </g>
          );
        })}
      </svg>
      
      {/* Cursor glow effect */}
      <div
        style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
};

// Interactive Dimension Word Component
const DimensionWord: React.FC<{ children: string }> = ({ children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        color: isHovered ? '#ff6b00' : '#ff6b00',
        scale: isHovered ? 1.05 : 1,
        textShadow: isHovered 
          ? '0 0 20px rgba(255, 107, 0, 0.8), 0 0 30px rgba(255, 107, 0, 0.4)'
          : '0 0 0px rgba(255, 107, 0, 0)',
      }}
      transition={{ duration: 0.15 }}
      style={{
        display: 'inline-block',
        fontWeight: 600,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {children}
      {isHovered && (
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            right: 0,
            height: '2px',
            background: '#ff6b00',
            transformOrigin: 'left',
          }}
        />
      )}
    </motion.span>
  );
};
export const Hero: React.FC = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 40px 80px' : '120px 50px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isMobile ? '500px' : isTablet ? '550px' : '600px',
      }}
    >
      <AnimatedBackground />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Title 
            level={1} 
            style={{ 
              color: '#fff', 
              fontSize: isMobile ? '36px' : isTablet ? '48px' : '64px', 
              marginBottom: isMobile ? '16px' : '24px', 
              fontWeight: 800,
              lineHeight: '1.1',
              letterSpacing: '-1px',
              padding: isMobile ? '0 10px' : '0'
            }}
          >
            AI-First Serverless Database
          </Title>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Paragraph style={{ 
            fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px', 
            color: 'rgba(255,255,255,0.75)', 
            maxWidth: isMobile ? '100%' : isTablet ? '600px' : '750px', 
            margin: isMobile ? '0 auto 32px' : isTablet ? '0 auto 40px' : '0 auto 56px',
            lineHeight: '1.7',
            fontWeight: 400,
            padding: isMobile ? '0 10px' : '0'
          }}>
            Auto-RAG that redefines retrieval for agents with <DimensionWord>temporal</DimensionWord>, <DimensionWord>contextual</DimensionWord>, <DimensionWord>behavioral</DimensionWord>, and <DimensionWord>semantic</DimensionWord> dimensions. Built on Cloudflare's edge network for millisecond latency.
          </Paragraph>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Space size={isMobile ? "middle" : "large"} direction={isMobile ? "vertical" : "horizontal"} style={{ width: isMobile ? '100%' : 'auto' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<CalendarOutlined />}
              style={{ 
                height: isMobile ? '48px' : '56px', 
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 600,
                background: '#ff6b00',
                borderColor: '#ff6b00',
                paddingLeft: isMobile ? '24px' : '32px',
                paddingRight: isMobile ? '24px' : '32px',
                boxShadow: '0 4px 20px rgba(255, 107, 0, 0.3)',
                width: isMobile ? '90%' : 'auto',
                maxWidth: isMobile ? '300px' : 'none'
              }}
              href="https://calendly.com/ar-aldhafeeri11/meridiandb-q-a" 
              target="_blank"
            >
              Talk to an Engineer
            </Button>
            <Button 
              size="large" 
              icon={<FileTextOutlined />}
              style={{ 
                height: isMobile ? '48px' : '56px', 
                fontSize: isMobile ? '14px' : '16px',
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                paddingLeft: isMobile ? '24px' : '32px',
                paddingRight: isMobile ? '24px' : '32px',
                backdropFilter: 'blur(10px)',
                width: isMobile ? '90%' : 'auto',
                maxWidth: isMobile ? '300px' : 'none'
              }}
              href="https://araldhafeeri.github.io/MeridianDB/" 
              target="_blank"
            >
              Read the Docs
            </Button>
          </Space>
        </motion.div>
      </div>
      </motion.div>
  )
};
