import { Repository } from 'typeorm'
import { ITenant } from '../types'
import { Tenant } from '../entity/Tenant'

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData)
    }

    async findAll() {
        return await this.tenantRepository.find()
    }

    async findById(tenantId: number) {
        return await this.tenantRepository.findOneBy({
            id: tenantId,
        })
    }
}
