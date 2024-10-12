import { Conta } from "./contas";
import { Comunidade, SubComunidade } from "./comunidades";
import { Post } from "./posts";

export class Rede{
    contas: Array<Conta>
    comunidades: Array<Comunidade>
    sub_comunidades:Array<Comunidade>
    posts: Array<Post>

    constructor(BancoContas: Array<Conta>, BancoComunidades: Array<Comunidade>, BancoPosts: Array<Post>){
        this.contas = BancoContas
        this.comunidades = BancoComunidades
        this.posts = BancoPosts
    }

    GetContas(): Array<Conta>{
        return this.contas
    }

    public CriarConta(conta: Conta): void{
        this.contas.push(conta)
    }

    public GetContaById(Id_Conta: number): Conta {
        for (let conta of this.contas) {
            if (conta.GetIdConta() === Id_Conta) {
                return conta
            }
        }
        throw new Error("Conta não encontrada")
    }

    GetContaByNomeUsuario(nomedePerfil: string): Conta {
        for (let conta of this.contas) {
            if (conta.GetNomeUsuario() === nomedePerfil){
                return conta
            }
        }
        throw new Error("Conta nâo encontrada")
    }

    ArmazenarPosts(post: Post): void{
        for (const comunidade of this.comunidades) {
            if(post.GetDestinatario() === comunidade.titulo){
                comunidade.posts_comunidades.push(post)
            }
        }
        throw new Error("Comunidade não encontrada")
    }
}
