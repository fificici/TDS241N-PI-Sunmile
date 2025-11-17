import { AppDataSource } from '../config/data-source'
import { Student } from '../models/Student'
import { Repository } from 'typeorm'
import { User } from '../models/User'

export class StudentRepository {
  private repository: Repository<Student>

  constructor() {
    this.repository = AppDataSource.getRepository(Student)
  }

  async findById(id: number): Promise<Student | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'], 
    })
  }

  async findByUserId(userId: number): Promise<Student | null> {
    return this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    })
  }

  async createAndSave(data: { bio: string; institution: string; enrollment: string; user: User }): Promise<Student> {
    if (!data.institution) {
      throw new Error('Instituição é obrigatório')
    }

    if(!data.enrollment) {
        throw new Error('Matrícula é obrigatório')
    }

    if (!data.user) {
      throw new Error('Usuário associado é obrigatório')
    }

    const student = this.repository.create({
      bio: data.bio,
      institution: data.institution,
      enrollment: data.enrollment,
      user: data.user,
    })

    return this.repository.save(student)
  }

  async save(student: Student): Promise<Student> {
    return this.repository.save(student)
  }

  async remove(student: Student): Promise<Student> {
    return this.repository.remove(student)
  }
}
