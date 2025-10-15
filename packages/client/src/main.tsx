import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// Create a client for hydration
const queryClient = new QueryClient()

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
  </React.StrictMode>
)
