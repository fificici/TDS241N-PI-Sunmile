import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn} from 'typeorm'
import { Professional } from './Professional'

@Entity('pro_posts')
export class ProPost {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text' })
  content!: string

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional!: Professional

  @CreateDateColumn()
  created_at!: Date

  constructor(title: string, content: string, professional: Professional) {
    this.title = title
    this.content = content
    this.professional = professional
  }
}
  