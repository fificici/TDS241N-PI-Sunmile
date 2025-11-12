import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import { Repository } from 'typeorm'

export class UserRepository {
    private repository: Repository<User>

  constructor() {

    this.repository = AppDataSource.getRepository(User)
  }

  async findById(id: number): Promise<User | null> {

    return this.repository.findOneBy({ id })
  }

  async findByName(name: string): Promise<User | null> {

    return this.repository.findOneBy({ name })
  }
  
}