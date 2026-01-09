import { PrismaDB } from "../types/prisma"

export async function editArticle(
  prisma: PrismaDB,
  articleId: string,
  title: string,
  content: string
) {

    const wordCount = content.trim().split(/\s+/).length;
  
    return await prisma.$transaction(async (tx) => {
        const article = await tx.article.findUnique({
          where:{
            id: articleId
          },
          select:{
            current_version: true
          },
        });

        if(!article){
            throw new Error("Article not found");
        }

        const nextVersion = article.current_version + 1;

        await tx.articleVersion.create({
          data:{
            articleId,
            version: nextVersion,
            title,
            content,
            wordCount,
          }
        });

        await tx.article.update({
          where: {
            id: articleId
          },
          data:{
            current_version: nextVersion
          }
        })

        return {
          articleId,
          version: nextVersion
        }
    });
}