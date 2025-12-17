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

  async findByPhone(phone_number: string): Promise<Student | null> {
    return this.repository.findOne({
      where: { phone_number },
      relations: ['user'], 
    })
  }

  async findByUserId(userId: number): Promise<Student | null> {
    return this.repository.findOne({
      where: { user: { id: userId } }, 
      relations: ['user'], 
    })
  }

  async createAndSave(data: { bio: string; phone_number: string; institution: string; enrollment: string; user: User }): Promise<Student>{

    if (!data.institution) throw new Error('Instituição é obrigatória')
    if (!data.enrollment) throw new Error('Matrícula é obrigatória')
    if (!data.phone_number) throw new Error('Matrícula é obrigatória')

    const student = this.repository.create({
      bio: data.bio,
      phone_number: data.phone_number,
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
