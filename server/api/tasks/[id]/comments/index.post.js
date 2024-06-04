import CommentService from '~/server/services/comment-service'

const commentService = new CommentService()

export default defineEventHandler(async (event) => {
    try {
        const userId = +event.context.auth?.id || 0
        const data = await readBody(event)
        const id = getRouterParam(event, "id")

        const ctx = {
            ...data,
            employee_id: userId,
            task_id: id,
        }
        
        const result = await commentService.createComment(ctx)
        
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})