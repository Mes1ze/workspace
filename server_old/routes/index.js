const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')


router.post('/users/token', userController.login)
router.delete('/users/token', authMiddleware, userController.logout)
router.put('/users/token', authMiddleware, userController.refresh)
router.get('/users',authMiddleware, userController.getUsers)
router.get('/users/:id', authMiddleware, userController.getUser)
router.get('/users/:id/role', authMiddleware, userController.getRole)
router.post('/users', authMiddleware, userController.createUser)
router.put('/users/:id', authMiddleware, userController.updateUser)


module.exports = router