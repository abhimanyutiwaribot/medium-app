import { PrismaDB } from "../types/prisma";

export async function getArticleVersions(
  prisma: PrismaDB,
  articleId: string
){

  const article = await prisma.article.findUnique({
    where:{
      id: articleId
    },
    select:{
      id: true
    },
  });

  if(!article){
    throw new Error("Article Not found");
  }

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