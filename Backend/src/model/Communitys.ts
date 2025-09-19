import { Account } from "./Accounts"
import { Post } from "./Posts"

export class Community{
    posts_Community: Array<Post>
    id_Community: number
    title: string
    description: string
    followers: Array<Account>

    constructor(PostsCommunitys: Array<Post>, IDCommunity: number, title_Community: string, description_Community: string, followers_da_Community: Array<Account>){
        this.posts_Community = PostsCommunitys
        this.id_Community = IDCommunity
        this.title = title_Community
        this.description = description_Community
        this.followers = followers_da_Community
    }

    Gettitle(): string{
        return this.title
    }

    Getdescription(): string{
        return this.description
    }

    Getfollowers(): Account[]{
        return this.followers
    }
}

export class SubCommunity extends Community {
    
    Community_Mae: Community
    Community_Adulta: boolean

    constructor(PostsCommunitys: Array<Post>, Id_da_Community: number, title_Community: string, description_Community: string,Community_para_maiores_de_18: boolean, Classe_de_Origem: Community, followers_da_Community: Array<Account>){
        super(PostsCommunitys, Id_da_Community, title_Community, description_Community, followers_da_Community)
        this.Community_Mae = Classe_de_Origem
        this.Community_Adulta = Community_para_maiores_de_18
    }
}
