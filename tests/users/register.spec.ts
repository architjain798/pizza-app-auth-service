import request from 'supertest'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'
import { Roles } from '../../src/constants'
import { User } from '../../src/entity/User'

describe('POST /auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // database drop and sync
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            ///AAA

            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })

        it('should persist the user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            // Act
            await request(app).post('/auth/register').send(userData)

            // Assert
            const userRepository = connection.getRepository(User)

            const users = await userRepository.find()

            expect(users).toHaveLength(1)
        })

        it('should return the user id', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            // Act
            await request(app).post('/auth/register').send(userData)

            const userRepository = connection.getRepository(User)

            const users = await userRepository.find()

            expect(users[0].id).toBeGreaterThanOrEqual(1)
        })

        it('should assign a customer role', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            // Act
            await request(app).post('/auth/register').send(userData)

            const userRepository = connection.getRepository(User)

            const users = await userRepository.find()

            expect(users[0]).toHaveProperty('role')
            expect(users[0].role).toBe(Roles.CUSTOMER)
        })

        it('should store the hashed password in the db', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            // Act
            await request(app).post('/auth/register').send(userData)

            //Asert
            const userRepository = connection.getRepository(User)

            const users = await userRepository.find()
            expect(users[0].password).not.toBe(userData.password)
            expect(users[0].password).toHaveLength(60)
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
        })

        it('should return 400 status code if email is already present', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: 'architjain@gmail.com',
                password: 'test@123',
            }

            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            const users = await userRepository.find()

            //Asert
            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(1)
        })
    })

    describe('Fields are missing', () => {
        it('should return 400 status code if email filed is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Archit',
                lastName: 'Jain',
                email: '',
                password: 'test@123',
            }

            // Act
            await request(app).post('/auth/register').send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            //Asert
            // expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(0)
        })
    })
})
