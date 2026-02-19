import { Hono } from 'hono'
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { getPrismaClient } from '../lib/prisma';
import { signinSchema, signupSchema } from '@abhimanyutiwaribot/medium-app-validation';
import { authMiddleware } from '../middleware/auth-middleware';

const user = new Hono<{

    Bindings: {
        DATABASE_URL: string,
        ACCELERATE_URL: string,
        JWT_SECRET_KEY: string
    },
    Variables: {
        userId: string
    }
}>()



// POST /api/v1/user/signup
// POST /api/v1/user/signin


const SEVEN_DAYS = 60 * 60 * 24 * 7; // seconds

function cookieOptions(env: string) {
    const isProd = env !== 'development';
    return {
        httpOnly: true,
        secure: true, // required for SameSite=None
        sameSite: 'None' as const, // Allows cross-domain cookies
        maxAge: SEVEN_DAYS,
        path: '/',
        // For local dev with http, you might need to adjust this, 
        // but for deployed workers.dev it MUST be None + Secure.
    };
}

// POST /api/v1/user/signup
user.post('/signup', async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL)

    try {
        const body = await c.req.json();

        const parsed = signupSchema.safeParse(body);

        if (!parsed.success) {
            return c.json({
                error: parsed.error.flatten()
            }, 400)
        }

        const isUser = await prisma.userModel.findUnique({
            where: { email: body.email },
        })

        if (isUser) {
            return c.json({ error: 'User already exists. Please sign in.' }, 409)
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)

        const newUser = await prisma.userModel.create({
            data: {
                email: body.email,
                password: hashedPassword,
                username: body.username,
                name: body.name ?? null,
            }
        })

        const jwt = await sign({
            sub: newUser.id,
            exp: Math.floor(Date.now() / 1000) + SEVEN_DAYS,
        }, c.env.JWT_SECRET_KEY)

        setCookie(c, 'access_token', jwt, cookieOptions('production'))

        return c.json({ message: 'User created successfully' }, 201);

    } catch (e) {
        console.error(e)
        return c.json({ error: 'Error while signing up' }, 500)
    }
});

// POST /api/v1/user/signin
user.post('/signin', async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL)

    try {
        const body = await c.req.json();
        const parsed = signinSchema.safeParse(body);

        if (!parsed.success) {
            return c.json({ error: parsed.error.flatten() }, 400)
        }

        const foundUser = await prisma.userModel.findUnique({
            where: { email: body.email }
        })

        if (!foundUser) {
            return c.json({ error: 'Invalid credentials' }, 401)
        }

        const isPasswordValid = await bcrypt.compare(body.password, foundUser.password)

        if (!isPasswordValid) {
            return c.json({ error: 'Invalid credentials' }, 401)
        }

        const jwt = await sign({
            sub: foundUser.id,
            exp: Math.floor(Date.now() / 1000) + SEVEN_DAYS,
        }, c.env.JWT_SECRET_KEY)

        setCookie(c, 'access_token', jwt, cookieOptions('production'))

        return c.json({ message: 'Welcome back' }, 200)

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500)
    }
});

// POST /api/v1/user/signout
user.post('/signout', (c) => {
    deleteCookie(c, 'access_token', {
        path: '/',
        secure: true,
        sameSite: 'None',
    });
    return c.json({ message: 'Signed out' }, 200);
});

user.get('/me', authMiddleware, async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);
    const userId = c.get('userId');

    const user = await prisma.userModel.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            name: true,
            bio: true,
            avatar: true,
            _count: {
                select: {
                    followers: true,
                    following: true,
                    article: true
                }
            }
        }
    });

    return c.json(user);
});

user.post('/password', authMiddleware, async (c) => {
    const prisma = getPrismaClient(c.env.ACCELERATE_URL);
    const userId = c.get('userId');

    try {
        const { currentPassword, newPassword } = await c.req.json();

        if (!currentPassword || !newPassword) {
            return c.json({ error: 'Missing password fields' }, 400);
        }

        if (newPassword.length < 6) {
            return c.json({ error: 'New password must be at least 6 characters' }, 400);
        }

        const foundUser = await prisma.userModel.findUnique({
            where: { id: userId }
        });

        if (!foundUser) {
            return c.json({ error: 'User not found' }, 404);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, foundUser.password);

        if (!isPasswordValid) {
            return c.json({ error: 'Incorrect current password' }, 401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.userModel.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return c.json({ message: 'Password updated successfully' }, 200);

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default user;



