import { Conta } from "./contas"

export class Comunidade{
    id_Comunidade: number
    titulo: string
    descricao: string
    seguidores: Array<Conta>

    constructor(IDComunidade: number, titulo_Comunidade: string, descricao_comunidade: string, seguidores_da_comunidade: Array<Conta>){
        this.id_Comunidade = IDComunidade
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

    GetSeguidores(): Conta[]{
        return this.seguidores
    }
}

export class SubComunidade extends Comunidade {
    Comunidade_Mae: Comunidade
    comunidade_Adulta: boolean

    constructor(Id_da_comunidade: number, titulo_Comunidade: string, descricao_comunidade: string,comunidade_para_maiores_de_18: boolean, Classe_de_Origem: Comunidade, seguidores_da_comunidade: Array<Conta>){
        super(Id_da_comunidade, titulo_Comunidade, descricao_comunidade, seguidores_da_comunidade)
        this.Comunidade_Mae = Classe_de_Origem
        this.comunidade_Adulta = comunidade_para_maiores_de_18
    }
}

