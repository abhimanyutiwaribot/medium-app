import "dotenv/config.js"
import { PrismaClient } from "../generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
import { withAccelerate } from "@prisma/extension-accelerate";

// export function getPrismaClient(database_url: string) {
//     if(!database_url){
//         throw new Error("database_url is not defined")
//     }
//     const pool = new Pool({
//         connectionString: database_url
//     })
//     const adapter = new PrismaPg(pool)

//     const prisma = new PrismaClient({
//         adapter
//     })

//     return prisma
// }


/*
For production using prisma accelerate.

*/
export function getPrismaClient(accelerate_url: string){
    const prisma = new PrismaClient({
        accelerateUrl: accelerate_url
    }).$extends(withAccelerate())

    return prisma
}