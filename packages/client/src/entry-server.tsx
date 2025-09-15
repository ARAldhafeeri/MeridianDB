import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

export function render(url: string, initialState : any) {
  // Create a new QueryClient for each request
  const queryClient = new QueryClient()

  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StaticRouter>
    </React.StrictMode>
  )

  // Serialize the state for hydration
  const state = JSON.stringify(initialState).replace(/</g, '\\\\u003c')

  return { html, state }
}
