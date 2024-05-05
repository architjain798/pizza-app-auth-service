import { NextFunction, Response } from 'express'
import { TenantService } from '../services/TenantService'
import { CreateTenantRequest } from '../types'
import { Logger } from 'winston'
import createHttpError from 'http-errors'

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        let { name, address } = req.body

        if (!name || !address) {
            const error = createHttpError(
                400,
                'Missing name or address in the request body',
            )
            next(error)
            return
        }

        if (
            name &&
            address &&
            typeof name === 'string' &&
            typeof address === 'string'
        ) {
            // Trim leading and trailing spaces from name and address
            name = name.trim()
            address = address.trim()
        }

        if (name === '' || address === '') {
            const error = createHttpError(
                400,
                'Name or address cannot be empty',
            )
            next(error)
            return
        }

        this.logger.debug('Request for creating a tenant ', req.body)

        try {
            const tenant = await this.tenantService.create({ name, address })

            this.logger.info('Tenant has been created', { id: tenant.id })

            res.status(201).json({ id: tenant?.id })
        } catch (error) {
            next(error)
        }
    }
}
