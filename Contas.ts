let leitor = require("readline-sync")

export class Contas {
    nome: string
    descricao: string
    dataNascimento: Date
    seguindo: Array<Contas>
    seguidores: Array<Contas>
    inscricoes: Array<any>
    linguaPrincipal: string

    constructor(nomedePerfil: string, descricaoConta: string, idadeusuario: Date, seguindo: Array<Contas>, seguidores: Array<Contas>, inscricoes: Array<any>, lingua_principal: string){
        this.nome = nomedePerfil
        this.descricao = descricaoConta
        this.dataNascimento = idadeusuario
        this.seguindo = seguindo
        this.seguidores = seguidores
        this.inscricoes = inscricoes
        this.linguaPrincipal = lingua_principal
    }

    GetNomeUsuario(): string{
        return this.nome
    }

    GetDescricao(): string{
        return this.descricao
    }

    GetIdade(): Date{
        return this.dataNascimento
    }

    GetSeguindo(): Contas[]{
        return this.seguindo
    }

    GetSeguidores(): Contas[]{
        return this.seguidores
    }

    GetIncricoes(): Contas[] {
        return this.inscricoes
    }

    GetLinguaPrincipal(): string {
        return this.linguaPrincipal
    }

    SetConta(nomedePerfil: string, descricaoConta: string, idadeusuario: Date, lingua_principal: string): void{
        this.nome = nomedePerfil
        this.descricao = descricaoConta
        this.dataNascimento = idadeusuario
        this.linguaPrincipal = lingua_principal
    }

    AlterContaNome():void{
        let mudanca = leitor.question("Novo Nome: ")
        this.nome = mudanca
    }

    AlterContaDescricao():void{
        let mudanca = leitor.question("Nova Descricao: ")
        this.descricao = mudanca
    }

    AlterContaLinguaPrincipal():void{
        let mudanca = leitor.question("Nova lingua principal: ")
        this.linguaPrincipal = mudanca
    }
}
