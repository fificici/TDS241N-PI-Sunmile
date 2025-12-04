import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, AfterLoad, CreateDateColumn } from 'typeorm'
import * as bcrypt from "bcryptjs"

@Entity('users')
 
export class User {

    @PrimaryGeneratedColumn() 
    id!: number

    @Column({ length: 100, nullable: false }) 
    name: string

    @Column({ length: 20, nullable: false, unique: true }) 
    username: string

    @Column({ length: 100, nullable: false, unique: true }) 
    email: string

    @Column({ length: 11, nullable: false, unique: true })
    cpf: string

    @Column({ type: "date", nullable: false })
    birth_date: Date

    @Column({ length: 255, nullable: false })
    password: string

    @CreateDateColumn()
    created_at!: Date;

    @Column({ type: "enum", enum: ["user", "admin", "pro"], default: "user" })
    role!: "user" | "admin" | "pro"

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