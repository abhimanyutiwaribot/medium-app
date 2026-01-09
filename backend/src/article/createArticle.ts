import { PrismaDB } from "../types/prisma";


export async function createArticle(
	prisma: PrismaDB,
	authorId: string,
	title: string,
	content: string
) {
	const wordCount = content.trim().split(/\s+/).length;
	return await prisma.$transaction(async(tx) =>{
		const article = await tx.article.create({
			data:{
				authorId,
				published: false,
				current_version: 1,
			},
		});


		await tx.articleVersion.create({
			data:{
				articleId: article.id,
				version: 1,
				title,
				content,
				wordCount
			}
		})

		return article;
	});
}