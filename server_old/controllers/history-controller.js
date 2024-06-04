const historyService = require('../services/history-service')

class HistoryController {
    //history
    async createHistory(req, res, next) {
        try {
            const result = await historyService.createHistory(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async getHistory(req, res, next) {
        try {
            const result = await historyService.getHistory(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async getHistories(req, res, next) {
        try {
            const result = await historyService.getHistories(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async deleteHistory(req, res, next) {
        try {
            const result = await historyService.deleteHistory(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async updateHistory(req, res, next) {
        try {
            const result = await historyService.updateHistory(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new HistoryController()