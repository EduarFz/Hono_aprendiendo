import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './routes/userRoutes.js'
import { cors } from 'hono/cors'
import { basicAuth } from './middlewares/basicAuth.js'




const app = new Hono()
app.use('*', cors());

app.route('/users', userRoutes)
// app.use('/users/*', basicAuth)
// app.route('/users', userRoutes)


app.get('/', basicAuth, (c) => {
  return c.text('Hello juan!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
