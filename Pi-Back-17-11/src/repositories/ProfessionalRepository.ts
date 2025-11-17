import { AppDataSource } from '../config/data-source'
import { Professional } from '../models/Professional'
import { Repository } from 'typeorm'
import { User } from '../models/User'

export class ProfessionalRepository {
  private repository: Repository<Professional>

  constructor() {
    this.repository = AppDataSource.getRepository(Professional)
  }

  async findById(id: number): Promise<Professional | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'], 
    })
  }

  async findByUserId(userId: number): Promise<Professional | null> {
    return this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    })
  }

  async createAndSave(data: { bio: string; pro_registration: string; user: User }): Promise<Professional> {
    if (!data.pro_registration) {
      throw new Error('Registro profissional é obrigatório')
    }

    if (!data.user) {
      throw new Error('Usuário associado é obrigatório')
    }

    const professional = this.repository.create({
      bio: data.bio,
      pro_registration: data.pro_registration,
      user: data.user,
    })

    return this.repository.save(professional)
  }

  async save(professional: Professional): Promise<Professional> {
    return this.repository.save(professional)
  }

  async remove(professional: Professional): Promise<Professional> {
    return this.repository.remove(professional)
  }
}
