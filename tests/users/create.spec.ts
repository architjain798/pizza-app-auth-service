import request from 'supertest'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'
import createJWKSMock from 'mock-jwks'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'

// or we can give whoami the url
describe('POST /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5010')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()

        // database drop and sync
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should persist the user in database', async () => {
            // Register the user
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
                tenantId: 1,
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            //Assert
            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(userData.email)
            // expect(users[0].role).toBe(Roles.MANAGER)
        })

        it('should create a manager user', async () => {
            // Register the user
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
                tenantId: 1,
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            //Assert
            expect(users).toHaveLength(1)
            expect(users[0].role).toBe(Roles.MANAGER)
        })
        it('should return 403 if non admin user tries to create a user', async () => {
            // Register the user
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
                tenantId: 1,
            }

            const customerToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            })

            const response = await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${customerToken};`])
                .send(userData)

            //Assert
            expect(response.statusCode).toBe(403)
        })
    })
})
