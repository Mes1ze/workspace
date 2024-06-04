import CommentService from "~/server/services/comment-service"

const commentService = new CommentService()

export default defineEventHandler(async (event) => {
    try {
        const select = getQuery(event)
        const id = getRouterParam(event, 'id')
        const ctx = {
            select: select,
            id: id
        }
        
        const result = await commentService.getComment(ctx)
        
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})