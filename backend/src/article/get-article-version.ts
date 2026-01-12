import { PrismaDB } from "../types/prisma";

export async function getArticleVersion(
  prisma: PrismaDB,
  articleId: string,
  version: number
){
  const articleVersion = await prisma.articleVersion.findUnique({
    where:{
      articleId_version:{
        articleId,
        version
      }
    },
  });

  if(!articleVersion){
    throw new Error("Article not found");
  }

  return{
    articleId: articleVersion.articleId,
    version: articleVersion.version,
    title: articleVersion.title,
    content: articleVersion.content,
    wordCount: articleVersion.wordCount,
    createdAt: articleVersion.createdAt
  };
}