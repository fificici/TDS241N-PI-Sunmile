import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import { Repository } from 'typeorm'
import { verifyBirthDate, verifyCPF, verifyPassword, verifyUsername } from '../helpers/helpers'

export class UserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email })
  }

  findByUsername(username: string): Promise<User | null> {
    return this.repository.findOneBy({ username })
  }

  async createAndSave(data: Partial<User>): Promise<User> {
    
    if (!data.birth_date) throw new Error('Data de nascimento é obrigatória')
    if (!verifyBirthDate(data.birth_date)) throw new Error('Data de nascimento inválida')

    if (!data.password) throw new Error('Senha é obrigatória')
    if (!verifyPassword(data.password)) throw new Error('Senha inválida')

    if (!data.cpf) throw new Error('CPF é obrigatório')
    if (!verifyCPF(data.cpf)) throw new Error('CPF inválido')

    if (!data.username) throw new Error('Username é obrigatório')
    if (!verifyUsername(data.username)) throw new Error('Username inválido')

    const user = this.repository.create(data)
    return this.repository.save(user)
  }

  saveUser(user: User): Promise<User> {
    return this.repository.save(user)
  }

  removeUser(user: User): Promise<User> {
    return this.repository.remove(user)
  }
}
