import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from './User'
import { Post } from './Post'
  
@Entity('communities')

export class Community {

    // @PrimaryGeneratedColumn()
    id!: number
  
    @Column({ length: 100, unique: true })
    name: string
  
    @Column({ type: 'text', nullable: false })
    description: string
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'creator_id' })
    creator: User

    // @OneToMany(() => Post, (post) => post.community)
    // posts: Post[]
  
    @CreateDateColumn()
    created_at!: Date
  
    constructor(name: string, description: string, creator: User) {
    //   this.posts = posts     
      this.name = name
      this.description = description
      this.creator = creator
    }
}
  