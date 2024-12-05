// const batchGetCategories = async (categoryIds: string[]) => {
// 	const categories = await CategoryRepository.findByIds(categoryIds);
// 	return categoryIds.map(categoryId =>
// 		categories.find(
// 			category =>
// 				category.id === categoryId
// 		)
// 	)
// }

export const buildDataLoaders = () => ({
	// categoryLoader: new DataLoader<string, CategoryEntity | undefined>(
	// 	categoryIds =>
	// 		batchGetCategories(categoryIds as string[])
	// )
})
