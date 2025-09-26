import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('professionals') // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class Professioanl {


    @Column({ type: "text" })
    bio: string

    @Column({ length: 20, nullable: false, unique: true })
    pro_registration: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    constructor(bio: string, pro_registration: string, user: User) {

        this.bio = bio
        this.pro_registration = pro_registration
        this.user = user
    }
}