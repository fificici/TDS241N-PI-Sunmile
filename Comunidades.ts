import { Contas } from "./contas"

export class Comunidade{
    titulo: string
    descricao: string
    seguidores: Array<Contas>

    constructor(titulo_Comunidade: string, descricao_comunidade: string, seguidores_da_comunidade: Array<Contas>){
        this.titulo = titulo_Comunidade
        this.descricao = descricao_comunidade
        this.seguidores = seguidores_da_comunidade
    }

    GetTitulo(): string{
        return this.titulo
    }

    GetDescricao(): string{
        return this.descricao
    }

    GetSeguidores(): Contas[]{
        return this.seguidores
    }
}

export class SubComunidade extends Comunidade {
    Comunidade_Mae: Comunidade
    comunidade_Adulta: boolean

    constructor(titulo_Comunidade: string, descricao_comunidade: string,comunidade_para_maiores_de_18: boolean, Classe_de_Origem: Comunidade, seguidores_da_comunidade: Array<Contas>){
        super(titulo_Comunidade, descricao_comunidade, seguidores_da_comunidade)
        this.Comunidade_Mae = Classe_de_Origem
        this.comunidade_Adulta = comunidade_para_maiores_de_18
    }
}

