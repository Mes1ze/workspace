const kpiService = require('../services/kpi-service')

class KpiController {
    async kpiFromTask(req, res, next) {
        try {
            const result = await kpiService.kpiFromTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async kpiForWorker(req, res, next) {
        try {
            const result = await kpiService.kpiFromTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async kpiForAllWorkers(req, res, next) {
        try {
            const result = await kpiService.kpiFromTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new KpiController()