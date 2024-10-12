import { Conta } from "./contas"

export class Post{
    id_post: number
    private nomeUsuario: string
    private conteudo: string
    private comentarios: Array<Comentario>
    private curtidas: Array<Curtida>
    private dataHora: Date
    comunidade_destinada: string

    constructor(IdPostagem:number, nomeUsuario: string, conteudo: string, comunidadeDestinataria: string){
        this.id_post = IdPostagem
        this.nomeUsuario = nomeUsuario
        this.conteudo = conteudo
        this.comentarios = []
        this.curtidas = []
        this.dataHora = new Date()
        this.comunidade_destinada = comunidadeDestinataria
    }

    public GetIdPost(): number{
        return this.id_post
    }

    public GetConteudo(): string{
        return this.conteudo
    }

    public GetDataHora(): Date{
        return this.dataHora
    }

    public GetNomeUsuario(): string{
        return this.nomeUsuario
    }

    public GetCurtidas(): Array<Curtida>{
        return this.curtidas
    }

    GetDestinatario(): string{
        return this.comunidade_destinada
    }
    
    public ReceberCurtida(curtida: Curtida): void{
        this.curtidas.push(curtida)
    }

    public RemoverCurtida(contaLogada: Conta): void{
        for(let curtida of this.curtidas){
            if(curtida.GetNomeUsuario() === contaLogada.GetNomeUsuario()){
                this.curtidas.splice(this.curtidas.indexOf(curtida), 1)
            }
        }
    }

    public ReceberComentario(comentario: Comentario): void{
        this.comentarios.push(comentario)
    }

    public GetComentarios(): Array<Comentario> {
        return this.comentarios
    }

}

class Curtida{
    private nomeUsuario: string

    constructor(nomeUsuario: string){
        this.nomeUsuario = nomeUsuario
    }

    GetNomeUsuario(): string{
        return this.nomeUsuario
    }
    
}

class Comentario{
    private nomeUsuario: string
    private conteudo: string

    constructor(nomeUsuario: string, conteudo: string){
        this.nomeUsuario = nomeUsuario
        this.conteudo = conteudo
    }

    public GetNomeUsuario(): string{
        return this.nomeUsuario
    }

    public GetConteudo(): string{
        return this.conteudo
    }

}
