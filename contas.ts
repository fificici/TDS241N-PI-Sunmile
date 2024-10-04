let leitor = require("readline-sync")

export class Conta {
    nome: string
    descricao: string
    idade: number
    seguindo: Array<Conta>
    inscricoes: Array<any>
    linguaPrincipal: string

    constructor(nomedePerfil: string, descricaoConta: string, idadeusuario: number, seguindo: Array<Conta>, inscricoes: Array<any>, lingua_principal: string){
        this.nome = nomedePerfil
        this.descricao = descricaoConta
        this.idade = idadeusuario
        this.seguindo = seguindo
        this.inscricoes = inscricoes
        this.linguaPrincipal = lingua_principal
    }

    GetNomeUsuario(): string{
        return this.nome
    }

    GetDescricao(): string{
        return this.descricao
    }

    GetIdade(): number{
        return this.idade
    }

    GetSeguindo(): Conta[]{
        return this.seguindo
    }

    GetIncricoes(): Conta[] {
        return this.inscricoes
    }

    GetLinguaPrincipal(): string {
        return this.linguaPrincipal
    }

    SetConta(nomedePerfil: string, descricaoConta: string, idadeusuario: number, lingua_principal: string): void{
        this.nome = nomedePerfil
        this.descricao = descricaoConta
        this.idade = idadeusuario
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