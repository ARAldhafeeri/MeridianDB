import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title  })  => {
  return (
    <html>
      <head>
        <title>{title}</title>
        <script type="module" src="/src/client/entry.client.tsx"></script>
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
})