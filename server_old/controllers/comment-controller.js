const commentService = require('../services/comment-service')

class CommentController {
    //comment
    async createComment(req, res, next) {
        try {
            const result = await commentService.createComment(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async getComment(req, res, next) {
        try {
            const result = await commentService.getComment(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async getComments(req, res, next) {
        try {
            const result = await commentService.getComments(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async deleteComment(req, res, next) {
        try {
            const result = await commentService.deleteComment(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async updateComment(req, res, next) {
        try {
            const result = await commentService.updateComment(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CommentController()