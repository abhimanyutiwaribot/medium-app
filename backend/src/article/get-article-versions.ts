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

  const versions = await prisma.articleVersion.findMany({
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

  return {
    articleId,
    current_version: article.current_version,
    published_version: article.published_version,
    versions: versions.map((v) => ({
      version: v.version,
      title: v.title,
      created_At : v.createdAt,
      isPublished: v.version === article.published_version,
    }))
  };
 
}