import { PrismaDB } from "../types/prisma";


export async function createArticle(
	prisma: PrismaDB,
	authorId: string,
	title: string,
	content_markdown: string,
	content_json: any
) {
	const wordCount = content_markdown.trim().split(/\s+/).length;
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
				content: content_markdown,
				content_json,
				wordCount
			}
		})

		await tx.events.create({
			data:{
				userId: authorId,
				type: "ARTICLE_VERSION_CREATED",
				payload:{
					articleId: article.id,
					version: 1,
				}
			}
		})

		// console.log(content_json)

		return article;
	});
}