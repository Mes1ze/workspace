import CommentService from "~/server/services/comment-service"

const commentService = new CommentService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const result = await commentService.deleteComment(id)
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})