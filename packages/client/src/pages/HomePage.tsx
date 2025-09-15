import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api';

function HomePage() {
  const { data: hello, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const response = await apiFetch('/api/hello')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    }
  });

  return (
    <div className="home-container">
      <div className="text-center">
        <h1 className="main-title">
          Welcome to the Modern Stack
        </h1>
        <p className="main-description">
          Experience NextJS-like DX with Hono, Cloudflare Workers, Vite, and React.
          Built for speed, deployed to the edge.
        </p>
      </div>

      <div className="features-grid">
        <FeatureCard
          title="⚡ Lightning Fast"
          description="Powered by Cloudflare Workers with global edge deployment"
        />
        <FeatureCard
          title="🔥 Hot Reload"
          description="Instant updates during development with Vite"
        />
        <FeatureCard
          title="🛡️ Type Safe"
          description="Full TypeScript support across client and server"
        />
        <FeatureCard
          title="🌐 Edge Computing"
          description="Run code closer to your users for minimal latency"
        />
        <FeatureCard
          title="📦 Zero Config"
          description="Sensible defaults with easy customization"
        />
        <FeatureCard
          title="🚀 Serverless"
          description="No servers to manage, scales automatically"
        />
      </div>

      {/* API Status */}
      <div className="api-status-card">
        <h3 className="api-status-title">
          API Status
        </h3>
        
        {isLoading ? (
          <div className="loading-pulse">
            <div className="pulse-line pulse-line-1"></div>
            <div className="pulse-line pulse-line-2"></div>
          </div>
        ) : hello ? (
          <div className="api-status-content">
            <div className="status-indicator">
              <div className="status-dot status-connected"></div>
              <span className="status-text">Connected to Hono API</span>
            </div>
            <p className="api-response">
              Response: {hello.message}
            </p>
            <p className="api-timestamp">
              Timestamp: {hello.timestamp}
            </p>
          </div>
        ) : (
          <div className="status-indicator">
            <div className="status-dot status-error"></div>
            <span className="status-text">API connection failed</span>
          </div>
        )}
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="feature-card">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  )
}

export default HomePage