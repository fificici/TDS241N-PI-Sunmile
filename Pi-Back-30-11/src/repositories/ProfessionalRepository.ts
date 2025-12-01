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

  async findByPhone(phone_number: string): Promise<Professional | null> {
    return this.repository.findOne({
      where: { phone_number },
      relations: ['user'],
    })
  }

  async findByRegistration(pro_registration: string): Promise<Professional | null> {
    return this.repository.findOne({
      where: { pro_registration },
      relations: ['user'],
    })
  }

  async findByCPF(cpf: string): Promise<Professional | null> {
    return this.repository.findOne({
      where: { user: { cpf } },
      relations: ['user'],
    })
  }

  async findByUserId(userId: number): Promise<Professional | null> {
    return this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    })
  }

  async createAndSave(data: { 

    bio: string; 
    phone_number: string;
    pro_registration: string; 
    user: User 

  }): Promise<Professional> {

    if (!data.pro_registration) throw new Error('Registro profissional é obrigatório')
    if (!data.phone_number) throw new Error('Número de telefone é obrigatório')

    const professional = this.repository.create({
      bio: data.bio,
      phone_number: data.phone_number,
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
