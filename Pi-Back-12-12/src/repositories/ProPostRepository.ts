import { AppDataSource } from '../config/data-source'
import { Repository } from 'typeorm'
import { ProPost } from '../models/ProPost'

export class ProPostRepository {
  private repository: Repository<ProPost>

  constructor() {
    this.repository = AppDataSource.getRepository(ProPost)
  }

  async findAllWithProfessional(): Promise<ProPost[]> {
    return this.repository.find({
      relations: [
        'professional',
        'professional.user'
      ],
      order: { id: 'ASC' }
    })
  }

  async findByIdWithProfessional(id: number): Promise<ProPost | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        'professional',
        'professional.user'
      ]
    })
  }

  async findById(id: number): Promise<ProPost | null> {
    return this.repository.findOneBy({ id })
  }

  async createAndSave(data: Partial<ProPost>): Promise<ProPost> {
    const post = this.repository.create(data)
    return this.repository.save(post)
  }

  async save(post: ProPost): Promise<ProPost> {
    return this.repository.save(post)
  }

  async remove(post: ProPost): Promise<ProPost> {
    return this.repository.remove(post)
  }
}
