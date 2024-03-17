import request from 'supertest'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'

// or we can give whoami the url
describe('GET /auth/self', () => {
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
        it('should return the 200 status code', async () => {
            const response = await request(app).get('/auth/self').send()
            expect(response.statusCode).toBe(200)
        })

        it('should return the user data', async () => {
            const response = await request(app).get('/auth/self').send()
            expect(response.statusCode).toBe(200)
        })
    })
})
