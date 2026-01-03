import { Hono } from "hono";

const blog = new Hono;

// POST /api/v1/blog
// PUT /api/v1/blog
// GET /api/v1/blog/:id
// GET /api/v1/blog/bulk


blog.put('/', async (c) => {
    
});

blog.post('/', async (c) => {
    
});

blog.get('/:id', async (c) => {
    
});

blog.get('/bulk', async (c) => {
    
});

export default blog;
