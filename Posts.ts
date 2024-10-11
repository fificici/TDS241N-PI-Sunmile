let leitor = require("readline-sync")
import { Comunidade } from "./comunidades"
import { SubComunidade } from "./comunidades"
import { Post } from "./posts"

export class Conta {
    id_conta: number
    nome: string
    descricao: string
    data_nascimento: Date
    seguindo: Array<Conta>
    seguidores: Array<Conta>
    inscricoes: Array<Comunidade>
    subinscricoes: Array<SubComunidade>
    lingua_principal: string

    constructor(nomedePerfil: string, descricaoConta: string, idadeusuario: Date, seguindo: Array<Conta>, seguidores: Array<Conta>, inscricoes: Array<any>, subinscricoes: Array<SubComunidade>, lingua_principal: string){
        this.nome = nomedePerfil
        this.descricao = descricaoConta
        this.data_nascimento = idadeusuario
        this.seguindo = seguindo
        this.seguidores = seguidores
        this.inscricoes = inscricoes
        this.subinscricoes = subinscricoes
        this.lingua_principal = lingua_principal
    }

    GetIdConta(): number{
        return this.id_conta
    }
    GetNomeUsuario(): string{
        return this.nome
    }

    GetDescricao(): string{
        return this.descricao
    }

    GetIdade(): Date{
        return this.data_nascimento
    }

    GetSeguindo(): Conta[]{
        return this.seguindo
    }

    GetSeguidores(): Conta[]{
        return this.seguidores
    }

    GetIncricoes(): Comunidade[] {
        return this.inscricoes
    }

    GetSubInscricoes(): SubComunidade[]{
        return this.subinscricoes
    }

    GetLinguaPrincipal(): string {
        return this.lingua_principal
    }

    SetConta(nomedePerfil: string, descricaoConta: string, idadeusuario: Date, lingua_principal: string): void{
        this.nome = nomedePerfil
        this.descricao = descricaoConta
        this.data_nascimento = idadeusuario
        this.lingua_principal = lingua_principal
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
        this.lingua_principal = mudanca
    }
}
