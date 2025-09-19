import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import * as bcrypt from "bcryptjs";

@Entity('professionals') // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class Studen {

    @PrimaryGeneratedColumn() // Define que o campo será uma Chave Primária (PK) e Auto Incrementável (AI)
    id!: number;

    @Column({ length: 100, nullable: false }) // Define que o tamanho do campo é de 100 caracteres, e não pode ser nulo.
    name: string;

    @Column({ length: 255 })
    bio: string

    @Column({ length: 100, nullable: false, unique: true }) // Define que o campo é Único (UK)
    email: string;

    @Column({ length: 11, nullable: false, unique: true })
    cpf: string

    @Column({ length: 120 })
    institution: string

    @Column({ length: 20, nullable: false, unique: true })
    enrollment: string

    @Column({ length: 10, nullable: false })
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

    constructor(name: string, bio: string, email: string, cpf: string, institution: string, enrollment: string, birth_date: Date, password: string) {

        this.name = name
        this.bio = bio
        this.email = email
        this.cpf = cpf
        this.enrollment = enrollment
        this.institution = institution
        this.birth_date = birth_date
        this.password = password
    }
}