import { Conta } from "./contas"

export class Post{
    private nomeUsuario: string
    private conteudo: string
    private comentarios: Array<Comentario>
    private curtidas: Array<Curtida>
    private dataHora: Date

    constructor(nomeUsuario: string, conteudo: string){
        this.nomeUsuario = nomeUsuario
        this.conteudo = conteudo
        this.comentarios = []
        this.curtidas = []
        this.dataHora = new Date()
    }

    public getConteudo(): string{
        return this.conteudo
    }

    public getDataHora(): Date{
        return this.dataHora
    }

    public getNomeUsuario(): string{
        return this.nomeUsuario
    }

    public getCurtidas(): Array<Curtida>{
        return this.curtidas
    }

    public receberCurtida(curtida: Curtida): void{
        this.curtidas.push(curtida)
    }

    public removerCurtida(contaLogada: Conta): void{
        for(let curtida of this.curtidas){
            if(curtida.getNomeUsuario() === contaLogada.GetNomeUsuario()){
                this.curtidas.splice(this.curtidas.indexOf(curtida), 1)
            }
        }
    }

    public receberComentario(comentario: Comentario): void{
        this.comentarios.push(comentario)
    }

    public getComentarios(): Array<Comentario> {
        return this.comentarios
    }


}

class Curtida{
    private nomeUsuario: string

    constructor(nomeUsuario: string){
        this.nomeUsuario = nomeUsuario
    }

    getNomeUsuario(): string{
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

    public getNomeUsuario(): string{
        return this.nomeUsuario
    }

    public getConteudo(): string{
        return this.conteudo
    }

}