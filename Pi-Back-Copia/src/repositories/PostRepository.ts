import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import { Repository } from 'typeorm'

export class PostRepository {

  private repository: Repository<User>

  constructor() {

    this.repository = AppDataSource.getRepository(User)
  }

}