import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from './User'
import { Post } from './Post'
  
@Entity('comments')

export class Comment {

    @PrimaryGeneratedColumn()
    id!: number
  
    @Column({ type: 'text', nullable: false })
    content: string
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User

    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post
  
    @CreateDateColumn()
    created_at!: Date
  
    constructor(content: string, author: User, post: Post) {
      this.content = content
      this.author = author
      this.post = post
    }
}
  