import { Conta } from "./contas";
import { Comunidade } from "./comunidades";
import { Post } from "./posts";

export class Rede{
    contas: Array<Conta>
    comunidades: Array<Comunidade>
    posts: Array<Post>

    constructor(BancoContas: Array<Conta>, BancoComunidades: Array<Comunidade>, BancoPosts: Array<Post>){
        this.contas = BancoContas
        this.comunidades = BancoComunidades
        this.posts = BancoPosts
    }

    
}