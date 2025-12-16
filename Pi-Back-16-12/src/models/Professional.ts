import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { ProPost } from './ProPost'

@Entity('professionals') 

export class Professional {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 15, nullable: false, unique: true })
    phone_number: string

    @Column({ type: "text", nullable: true })
    bio: string | null

    @Column({ length: 20, nullable: false, unique: true })
    pro_registration: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @OneToMany(() => ProPost, post => post.professional)
    posts: ProPost[]

    constructor(bio: string, phone_number: string, pro_registration: string, user: User, posts: ProPost[]) {

        this.phone_number = phone_number
        this.bio = bio
        this.pro_registration = pro_registration
        this.user = user
        this.posts = posts
    }
}