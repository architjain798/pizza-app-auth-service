import { NextFunction, Response } from 'express'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { sign, JwtPayload } from 'jsonwebtoken'
import fs from 'fs'

import { UserService } from '../services/UserService'
import { RegisterUserRequest } from '../types'
import path from 'path'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'

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
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() })
        }

        const { firstName, lastName, email, password } = req.body

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
            let privateKey: Buffer

            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                )
            } catch (err) {
                const error = createHttpError(
                    500,
                    'Error while reading private key',
                )
                next(error)
                return
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            })

            //Persist the refresh token
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365 // 1YEAR

            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken)

            const newRefreshToken = await refreshTokenRepository.save({
                user: user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            })

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: 'HS256',
                expiresIn: '1y',
                issuer: 'auth-service',
                jwtid: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1000*60 sec * 60 minutes *
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            })

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
