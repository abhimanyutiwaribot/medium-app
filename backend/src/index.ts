import { Hono } from 'hono'
import user from './routes/user-routes'
import article from './routes/article-routes'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

/*


*/

app.route('/api/v1/user', user);
app.route('/api/v1/c', article);



export default app
