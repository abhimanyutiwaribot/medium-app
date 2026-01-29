import { Hono } from 'hono'
import user from './routes/user-routes'
import article from './routes/article-routes'
import { cors } from 'hono/cors'
// import { resolve } from 'node:dns'
import image from './routes/image-route'
import feed from './routes/feed-routes'
import profile from './routes/profile-routes'
import { runEventWorker } from './workers/event-worker'

interface Env {
  ACCELERATE_URL: string
}

const app = new Hono<{
  Bindings: Env
}>

app.use("*", cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.get('/api/v1/health', (c) => {
  try{
    return c.json({
    message: "i am fine !!"
  }, 201)
  }catch(e){
    return c.json({
      error: "i am dead"
    }, 501)
  }
})



app.route('/api/v1/user', user);
app.route('/api/v1/q', article);
app.route('/api/v1/image', image);
app.route('/api/v1/a', feed)
app.route('/api/v1/profile', profile)


export default {
   fetch: app.fetch,
   async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
   ){
    console.log('Scheduled event triggered at:', new Date(event.scheduledTime))
    console.log('ACCELERATE_URL:', env.ACCELERATE_URL ? 'exists' : 'missing')
    ctx.waitUntil(
      runEventWorker(env.ACCELERATE_URL)
    )
   }
}
