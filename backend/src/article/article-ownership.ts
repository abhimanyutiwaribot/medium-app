import { PrismaDB } from "../types/prisma";

export async function articleOwnership(
  prisma: PrismaDB,
  articleId: string,
  userId: string
){  
  const article = await prisma.article.findUnique({
    where:{
      id: articleId
    },
    select:{
      id: true,
      authorId: true,
      published: true,
      published_At: true,
      current_version: true,
      published_version: true
    }
  })

  if(!article){
    throw new Error("Article not found");
  }

  if(article.authorId !== userId){
    throw new Error("Unauthorized");
  }

  return article;

}