import CategoryService from '~/server/services/category-service'

const categoryService = new CategoryService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const result = await categoryService.deleteCategory(id)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})