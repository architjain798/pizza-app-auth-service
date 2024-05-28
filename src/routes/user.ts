/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'
import { UserController } from '../controllers/UserController'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import { UserService } from '../services/UserService'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userServices = new UserService(userRepository)
const userController = new UserController(userServices)

router.use('/', [authenticate, canAccess([Roles.ADMIN])])
router.post('/', (req, res, next) => {
    userController
        .create(req, res, next)
        .then(() => {})
        .catch(() => {})
})

export default router
