import { NextFunction, Response } from 'express'
import createHttpError from 'http-errors'
import { Logger } from 'winston'

import { UserService } from '../services/UserService'
import { RegisterUserRequest } from '../types'

export class AuthController {
    userService: UserService
    logger: Logger

    constructor(userService: UserService, logger: Logger) {
        this.userService = userService
        this.logger = logger
    }

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body

        if (!email) {
            const err = createHttpError(400, 'Email is not present')
            next(err)
            return
        }

        this.logger.debug('New request to register a user', {
            firstName,
            lastName,
            email,
            password: '**********',
        })
        try {
            // const userService = new UserService()
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })
            this.logger.info('User has been registered', { id: user.id })
            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
