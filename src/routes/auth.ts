import express, { NextFunction, Request, Response } from 'express'

import { AppDataSource } from '../config/data-source'
import logger from '../config/logger'
import { AuthController } from '../controllers/AuthController'
import { User } from '../entity/User'
import { UserService } from '../services/UserService'
import registerValidator from '../validators/register-validator'
import { TokenService } from '../services/TokenService'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const tokenService = new TokenService()
const authController = new AuthController(userService, logger, tokenService)

// router.post('/register', (req, res) => authController.register(req, res))

// Use the middleware before your route
router.use('/register', registerValidator)

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    authController
        .register(req, res, next)
        .then(() => {
            // Do something after successful registration if needed
            // res.status(200).send('Registration successful')
        })
        .catch(() => {
            // Handle errors
            // console.error(error)
            // res.status(500).send('Internal Server Error')
        })
})

export default router
