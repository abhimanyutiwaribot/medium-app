import { Hono } from 'hono'
import user from './routes/user-routes'
import article from './routes/article-routes'
import { cors } from 'hono/cors'
// import { resolve } from 'node:dns'
import image from './routes/image-route'
const app = new Hono()

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



export default app
