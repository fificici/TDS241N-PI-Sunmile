import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity('professionals') 

export class Professional {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 15, nullable: false, unique: true })
    phone_number: string

    @Column({ type: "text" })
    bio: string

    @Column({ length: 20, nullable: false, unique: true })
    pro_registration: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    constructor(bio: string, phone_number: string, pro_registration: string, user: User) {

        this.phone_number = phone_number
        this.bio = bio
        this.pro_registration = pro_registration
        this.user = user
    }
}