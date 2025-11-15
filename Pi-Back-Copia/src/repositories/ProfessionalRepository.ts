import { AppDataSource } from '../config/data-source'
import { Professional } from '../models/Professional'
import { Repository } from 'typeorm'

export class ProfessionalRepository{
    private repository: Repository<Professional>

    constructor() {

        this.repository = AppDataSource.getRepository(Professional)
    }

    async listAll(): Promise<Professional[]> {
        return this.repository.find({
          relations: ['user'],
          order: { id: 'ASC' }
        })
    }
    
    async findById(id: number): Promise<Professional | null> {
    
      return this.repository.findOneBy({ id })
    }

    async createAndSave(data: Partial<Professional>): Promise<Professional> {

        const post = this.repository.create(data)
        return this.repository.save(post)
    }

    async findByName(name: string): Promise<Professional | null> {
        return this.repository.findOneBy({ name })
    }
}