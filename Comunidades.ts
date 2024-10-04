import { Conta } from "./Contas"

export class Comunidade{
    titulo: string
    descricao: string
    seguidores: Array<Conta>

    constructor(titulo_Comunidade: string, descricao_comunidade: string, seguidores_da_comunidade: Array<Conta>){
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

    constructor(titulo_Comunidade: string, descricao_comunidade: string, seguidores_da_comunidade: Array<Conta>, Classe_de_Origem: Comunidades){
        super(titulo_Comunidade, descricao_comunidade, seguidores_da_comunidade)
        this.Comunidade_Mae = Classe_de_Origem
    }
}

let autismo = new Comunidade("Autismo", "Comunidade dedicada ao autismo", [])

let hiperfoco = new SubComunidade("Hiperfoco", "Nova subcomunidade feita para conversas e discussões dedicadas ao  hiperfoco do autismo", [], autismo)
