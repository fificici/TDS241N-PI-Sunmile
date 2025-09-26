import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('students') // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class Student {

    @Column({ type: 'text' })
    bio: string

    @Column({ length: 120 })
    institution: string

    @Column({ length: 50, nullable: false })
    enrollment: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    constructor(bio: string, institution: string, enrollment: string, user: User) {

        this.bio = bio
        this.enrollment = enrollment
        this.institution = institution
        this.user = user
    }
}