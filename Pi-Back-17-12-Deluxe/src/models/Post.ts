import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { Community } from './Community';
import { Comment } from './Comment';
  
@Entity('posts')

export class Post {

    @PrimaryGeneratedColumn()
    id!: number
  
    @Column({ length: 200 })
    title: string
  
    @Column({ type: 'text', nullable: false })
    content: string
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User
  
    @ManyToOne(() => Community, (community) => community.posts)
    @JoinColumn({ name: 'community_id' })
    community: Community
  
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[]
  
    @CreateDateColumn()
    created_at!: Date
  
    constructor(title: string, content: string, author: User, community: Community) {
      this.title = title
      this.content = content
      this.author = author
      this.community = community
    }
}
  