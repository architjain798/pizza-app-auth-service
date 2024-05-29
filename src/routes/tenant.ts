/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { TenantController } from '../controllers/TenantController'
import { TenantService } from '../services/TenantService'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService, logger)

router.use('/', [authenticate, canAccess([Roles.ADMIN])])
router.post('/', (req, res, next) => {
    tenantController
        .create(req, res, next)
        .then(() => {})
        .catch(() => {})
})

router.use('/', [authenticate, canAccess([Roles.ADMIN])])
router.get('/', (req, res, next) => {
    tenantController
        .findAll(req, res, next)
        .then(() => {})
        .catch(() => {})
})

router.use('/:tenantId', [authenticate, canAccess([Roles.ADMIN])])
router.get('/:tenantId', (req, res, next) => {
    tenantController
        .findById(req, res, next)
        .then(() => {})
        .catch(() => {})
})

export default router
