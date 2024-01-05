import createHttpError from 'http-errors'
import { Repository } from 'typeorm'

import { User } from '../entity/User'
import { UserData } from '../types'

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
            })
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store the data in the datacenter',
            )
            throw error
        }
    }
}
