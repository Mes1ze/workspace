import CategoryService from '~/server/services/category-service'

const categoryService = new CategoryService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id")

        const body = await readBody(event)
        const ctx = {
            task_id: id,
            category_id: body.category_id
        }

        const result = await categoryService.addCategory(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})