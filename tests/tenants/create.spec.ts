import request from 'supertest'
import { DataSource } from 'typeorm'
import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Roles } from '../../src/constants'

describe('POST /tenants', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let adminToken: string

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5010')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()

        // database drop and sync
        await connection.dropDatabase()
        await connection.synchronize()

        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        })
    })

    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            }
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            expect(response?.statusCode).toBe(201)
        })

        it('should create a tenant in the database', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            }
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            const tenantRepository = connection.getRepository('Tenant')
            const tenants = await tenantRepository.find()

            expect(tenants).toHaveLength(1)
            expect(tenants[0].name).toBe(tenantData?.name)
            expect(tenants[0].address).toBe(tenantData?.address)
        })

        it('should return 401 if user is not authenticated', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            }
            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            const tenantRepository = connection.getRepository('Tenant')
            const tenants = await tenantRepository.find()

            expect(response.statusCode).toBe(401)
            expect(tenants).toHaveLength(0)
        })

        it('should return 403 if user is not admin', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            }

            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken};`])
                .send(tenantData)

            const tenantRepository = connection.getRepository('Tenant')
            const tenants = await tenantRepository.find()

            expect(response.statusCode).toBe(403)
            expect(tenants).toHaveLength(0)
        })

        it('should validate the request for empty object', async () => {
            const tenantData = {}
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            expect(response?.statusCode).toBe(400)
        })

        it('should validate the request for fields having empty string', async () => {
            const tenantData = {
                name: ' ',
                address: ' ',
            }
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            expect(response?.statusCode).toBe(400)
        })

        it.todo('should return the tenant list')
        it.todo('should return the tenant list by Id')
        it.todo('should update the tenant by Id')
        it.todo('should delete the tenant by Id')
    })
})
