const performerService = require('../services/performer-service')

class PerformerController {
    //performer
    async createTaskPerformer(req, res, next) {
        try {
            const result = await performerService.createTaskPerformer(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async deleteTaskPerformer(req, res, next) {
        try {
            const result = await performerService.deleteTaskPerformer(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new PerformerController()