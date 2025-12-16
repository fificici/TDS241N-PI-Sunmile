import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('students') 

export class Student {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'text' })
    bio: string

    @Column({ length: 15, nullable: false, unique: true })
    phone_number: string

    @Column({ length: 120, nullable: false })
    institution: string

    @Column({ length: 50, nullable: false })
    enrollment: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    constructor(bio: string, phone_number: string, institution: string, enrollment: string, user: User) {

        this.bio = bio
        this.phone_number = phone_number
        this.enrollment = enrollment
        this.institution = institution
        this.user = user
    }
}