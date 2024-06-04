import CommentService from "~/server/services/comment-service"

const commentService = new CommentService()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const id = getRouterParam(event, 'id')
        
        const ctx = {
            ...body,
            id: id
        }

        const result = await commentService.updateComment(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})