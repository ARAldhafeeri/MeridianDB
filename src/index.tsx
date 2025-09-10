import { Hono } from 'hono'
import { renderer } from './renderer'
import App from './client/app'

const app = new Hono()

app.use(renderer)

app.get('/api/message', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

app.get('/', (c) => {
  return c.render(<App />)
})

export default app
