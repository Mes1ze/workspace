const taskService = require('../services/task-service')

class TaskController {
    //task
    async createTask(req, res, next) {
        try {
            const result = await taskService.createTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async getTask(req, res, next) {
        try {
            const result = await taskService.getTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async getTasks(req, res, next) {
        try {
            const result = await taskService.getTasks(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async deleteTask(req, res, next) {
        try {
            const result = await taskService.deleteTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async updateTask(req, res, next) {
        try {
            const result = await taskService.updateTask(req)
            res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TaskController()