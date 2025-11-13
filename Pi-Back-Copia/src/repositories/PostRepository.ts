import { AppDataSource } from '../config/data-source'
import { Post } from '../models/Post'
import { Repository } from 'typeorm'

export class UserRepository {
  private repository: Repository<Post>

  constructor() {

    this.repository = AppDataSource.getRepository(Post)
  }

  async listAll(): Promise<Post[]> {
    return this.repository.find({
      relations: ['user'],
      order: { id: 'ASC' }
    })
  }

  async findById(id: number): Promise<Post | null> {

    return this.repository.findOneBy({ id })
  }

  async findByTitle(title: string): Promise<Post | null> {

    return this.repository.findOneBy({ title })
  }

  async removePost(Post: Post): Promise<Post> {

    return this.repository.remove(Post)
  }
}