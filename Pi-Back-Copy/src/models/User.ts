import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import * as bcrypt from "bcryptjs";

@Entity('users') // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class User {

    @PrimaryGeneratedColumn() // Define que o campo será uma Chave Primária (PK) e Auto Incrementável (AI)
    id!: number

    @Column({ length: 100, nullable: false }) // Define que o tamanho do campo é de 100 caracteres, e não pode ser nulo.
    name: string

    @Column({ length: 30, nullable: false, unique: true }) // Define que o tamanho do campo é de 100 caracteres, e não pode ser nulo.
    username: string

    @Column({ length: 100, nullable: false, unique: true }) // Define que o campo é Único (UK)
    email: string

    @Column({ length: 11, nullable: false, unique: true })
    cpf: string

    @Column({ nullable: false })
    birth_date: Date

    @Column({ length: 255, nullable: false })
    password: string

    private originalPassword!: string

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password && this.password !== this.originalPassword) {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
        }
    }

    @AfterLoad()
    private setPreviousPassword(){
        this.originalPassword = this.password
    }

    constructor(name: string, username: string, email: string, cpf: string, birth_date: Date, password: string) {

        this.name = name
        this.username = username
        this.email = email
        this.cpf = cpf
        this.birth_date = birth_date
        this.password = password
    }
}