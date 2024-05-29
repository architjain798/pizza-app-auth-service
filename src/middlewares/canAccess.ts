import { Response, NextFunction, Request } from 'express'
import { AuthRequest } from '../types'
import createHttpError from 'http-errors'

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest
        const rolesFromToken = _req.auth.role

        if (!roles.includes(rolesFromToken)) {
            const error = createHttpError(
                403,
                "You don't have enough permissions",
            )
            next(error)
        }
        next()
    }
}
