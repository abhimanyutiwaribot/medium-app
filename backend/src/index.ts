import { Hono } from 'hono'
import user from './routes/user-routes'
import blog from './routes/blog-routes'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

/*


*/

app.route('/api/v1/user', user);
// app.route('/api/v1/blog', blog);



export default app
