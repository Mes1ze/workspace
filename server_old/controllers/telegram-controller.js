const telegramService = require('../services/telegram-service')

class TelegramController {
    async tg(req, res, next) {
        try {
            const result = await kpiService.kpiFromTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TelegramController()