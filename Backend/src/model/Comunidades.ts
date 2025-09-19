import { Conta } from "./Contas"
import { Post } from "./Posts"

export class Comunidade{
    posts_comunidades: Array<Post>
    id_Comunidade: number
    titulo: string
    descricao: string
    seguidores: Array<Conta>

    constructor(PostsComunidades: Array<Post>, IDComunidade: number, titulo_Comunidade: string, descricao_comunidade: string, seguidores_da_comunidade: Array<Conta>){
        this.posts_comunidades = PostsComunidades
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
    
    comunidade_Mae: Comunidade
    comunidade_Adulta: boolean

    constructor(PostsComunidades: Array<Post>, Id_da_comunidade: number, titulo_Comunidade: string, descricao_comunidade: string,comunidade_para_maiores_de_18: boolean, Classe_de_Origem: Comunidade, seguidores_da_comunidade: Array<Conta>){
        super(PostsComunidades, Id_da_comunidade, titulo_Comunidade, descricao_comunidade, seguidores_da_comunidade)
        this.comunidade_Mae = Classe_de_Origem
        this.comunidade_Adulta = comunidade_para_maiores_de_18
    }
}
