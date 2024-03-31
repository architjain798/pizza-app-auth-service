import { NextFunction, Response } from 'express'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload } from 'jsonwebtoken'

import { UserService } from '../services/UserService'
import { AuthRequest, RegisterUserRequest } from '../types'
import { TokenService } from '../services/TokenService'
import createHttpError from 'http-errors'
import { CredentialService } from '../services/CredentialService'

export class AuthController {
    userService: UserService
    logger: Logger
    tokenService: TokenService
    credentialService: CredentialService

    constructor(
        userService: UserService,
        logger: Logger,
        tokenService: TokenService,
        credentialService: CredentialService,
    ) {
        this.userService = userService
        this.logger = logger
        this.tokenService = tokenService
        this.credentialService = credentialService
    }

    addCookieToResponse(
        res: Response,
        accessToken: string,
        refreshToken: string,
    ) {
        this.logger.debug('Add to cookie called')
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

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)
            this.logger.debug('Access token generated', { accessToken })

            //Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })
            this.logger.debug('Refresh token generated', { refreshToken })

            // set cookie to response
            this.addCookieToResponse(res, accessToken, refreshToken)

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() })
        }

        const { email, password } = req.body

        this.logger.debug('New request to login a user', {
            email,
            password: '**********',
        })

        try {
            //Check if username (email) exists in the database
            const user = await this.userService.findByEmail(email)

            if (!user) {
                const err = createHttpError(
                    400,
                    'Email or password does not match  ',
                )
                next(err)
                return
            }

            // compare password
            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user?.password,
            )

            if (!passwordMatch) {
                const err = createHttpError(
                    400,
                    'Email or password does not match  ',
                )
                next(err)
                return
            }

            // generate token

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)
            this.logger.debug('Access token generated', { accessToken })
            //Persist the refresh token

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })
            this.logger.debug('Refresh token generated', { refreshToken })
            // Add token to cookie
            // set cookie to response
            this.addCookieToResponse(res, accessToken, refreshToken)

            this.logger.info('User has been logged in', { id: user?.id })

            // return the response (id)
            res.status(200).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub))
        res.json({ ...user, password: undefined })
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            }
            const accessToken = this.tokenService.generateAccessToken(payload)
            this.logger.debug('Access token generated', { accessToken })

            const user = await this.userService.findById(Number(req.auth.sub))

            if (!user) {
                const error = createHttpError(
                    400,
                    'User with the token could not find',
                )
                next(error)
                return
            }

            //Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            // delete the old refresh token received from req
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })
            this.logger.debug('Refresh token generated', { refreshToken })

            // set cookie to response
            this.addCookieToResponse(res, accessToken, refreshToken)

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))
            this.logger.info('Refresh token has been deleted ', {
                id: req.auth.id,
            })
            this.logger.info('User has been logged out', { id: req.auth.sub })

            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')

            res.json({})
        } catch (error) {
            next(error)
            return
        }
    }
}
