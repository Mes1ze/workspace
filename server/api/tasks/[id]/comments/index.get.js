import CommentService from '~/server/services/comment-service'

const commentService = new CommentService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = getQuery(event)
        ctx.id = getRouterParam(event, 'id')
        
        const result = await commentService.getComments(ctx)
        
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})