import express from 'express'
import { AppDataSource } from '../config/data-source'
import { AuthController } from '../controllers/AuthController'
import { User } from '../entity/User'
import { UserService } from '../services/UserService'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const authController = new AuthController(userService)

// router.post('/register', (req, res) => authController.register(req, res))

router.post('/register', (req, res) => {
    authController
        .register(req, res)
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
