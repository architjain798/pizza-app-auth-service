import request from 'supertest'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { UserResponse } from '../../src/types'
import { truncateTable } from '../utils'

describe('POST /auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // database truncate
        await truncateTable(connection)
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

            const users: UserResponse[] = await userRepository.find()

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

            const users: UserResponse[] = await userRepository.find()

            expect(users[0].id).toBeGreaterThanOrEqual(1)
        })
    })

    describe('Fields are missing', () => {})
})
