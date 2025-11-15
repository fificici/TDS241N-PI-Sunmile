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

  async findByEmail(email: string): Promise<User | null> {

    return this.repository.findOneBy({ email })
  }

  async verifyBirthDate(birth_date: Date) {
    
  }

  async createAndSave(data: Partial<User>): Promise<User> {

    const user = this.repository.create(data)
    return this.repository.save(user)
  }

  async saveUser(user: User): Promise<User> {

    return this.repository.save(user)
  }

  async removeUser(user: User): Promise<User> {

    return this.repository.remove(user)
  }
}
