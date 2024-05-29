import { NextFunction, Response } from 'express'
import { UserService } from '../services/UserService'
import { CreateUserRequest } from '../types'
import { Roles } from '../constants'

export class UserController {
    constructor(private userService: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body

        if (!firstName || !lastName || !email || !password) {
            return res
                .status(400)
                .json({ message: 'Missing required fields in request body' })
        }

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            })
            res.status(201).json({ id: user?.id })
        } catch (error) {
            next(error)
        }
    }
}
