import { PrismaDB } from "../types/prisma";
import { articleOwnership } from "./article-ownership";

export async function getArticleVersions(
  prisma: PrismaDB,
  articleId: string,
  userId: string
){

  const article = await articleOwnership(
    prisma,
    articleId,
    userId
  )

  return await prisma.articleVersion.findMany({
    where:{
      articleId
    },
    select:{
      version: true,
      title: true,
      wordCount: true,
      createdAt: true
    },
    orderBy:{
      version: "desc"
    }
  });
 
}