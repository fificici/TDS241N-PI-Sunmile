import { Comunidade } from "./Comunidades"
import { SubComunidade } from "./Comunidades"
import { Post } from "./Posts"

export class Conta {
    nome: string
    descricao: string
    data_nascimento: Date
    seguindo: Array<Conta>
    seguidores: Array<Conta>
    inscricoes: Array<Comunidade>
    subinscricoes: Array<SubComunidade>
    lingua_principal: string
    posts_pessoais: Array<Post>

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

    GetInscricoes(): Comunidade[] {
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

    AlterContaNome(mudanca: string):void{
        this.nome = mudanca
    }

    AlterContaDescricao(mudanca: string):void{
        this.descricao = mudanca
    }

    AlterContaLinguaPrincipal(mudanca: string):void{
        this.lingua_principal = mudanca
    }
}
