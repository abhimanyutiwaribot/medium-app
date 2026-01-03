import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';

const user = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        DIRECT_DATABASE_URL: string,
        JWT_SECRET_KEY: string
    }
}>()

 
// POST /api/v1/user/signup
// POST /api/v1/user/signin


user.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DIRECT_DATABASE_URL
    }).$extends(withAccelerate())

    // console.log(c.env.DATABASE_URL)

    try {
        const body = await c.req.json();    

        const isUser = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        })

        if(isUser){
            return c.json({
                message: `User already exists. Please Sign in.`
            }, 409)
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)


        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name ?? null,
            }
        })

        const jwt = await sign({
            id: newUser.id
        }, c.env.JWT_SECRET_KEY)
        
        return c.json({
            message: "User Created Successfully",
            token: jwt
        })

    } catch (e) {
        console.error(e)
        c.status(403);
        return c.json({
            error: `error while signing up`
        })
    }
});

user.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DIRECT_DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const body = await c.req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            }
        })

        if(!user){
            c.status(403);
            return c.json({
                error: `Credentials are invalid`
            })
        }

        const isPasswordvalid = await bcrypt.compare(
            body.password, user.password
        )

        if(!isPasswordvalid){
            return c.json({
                error: "Invalid Credentials"
            }, 403)
        }

        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET_KEY)

        return c.json({
            message: `Welcome back`,
            token: jwt
        }, 200)

    }catch(e){
        console.error(e);
        c.json({
            message: "Internal Server Error",
        }, 500)

    }
});


export default user;


