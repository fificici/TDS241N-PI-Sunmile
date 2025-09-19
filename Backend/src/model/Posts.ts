import { Account } from "./Accounts"

export class Post{
    id_post: number
    private UserName: string
    private Content: string
    private Comments: Array<Comment>
    private Likes: Array<Like>
    private DateHour: Date
    DestinatedCommunity: string

    constructor(IdPostagem:number, UserName: string, Content: string, comunidadeDestinataria: string){
        this.id_post = IdPostagem
        this.UserName = UserName
        this.Content = Content
        this.Comments = []
        this.Likes = []
        this.DateHour = new Date()
        this.DestinatedCommunity = comunidadeDestinataria
    }

    public GetIdPost(): number{
        return this.id_post
    }

    public GetContent(): string{
        return this.Content
    }

    public GetDateHour(): Date{
        return this.DateHour
    }

    public GetUserName(): string{
        return this.UserName
    }

    public GetLikes(): Array<Like>{
        return this.Likes
    }

    GetDestinatario(): string{
        return this.DestinatedCommunity
    }
    
    public ReceberLike(Like: Like): void{
        this.Likes.push(Like)
    }

    public ReceberComment(Comment: Comment): void{
        this.Comments.push(Comment)
    }

    public GetComments(): Array<Comment> {
        return this.Comments
    }

}

class Like{
    private UserName: string

    constructor(UserName: string){
        this.UserName = UserName
    }

    GetUserName(): string{
        return this.UserName
    }
    
}

class Comment{
    private UserName: string
    private Content: string

    constructor(UserName: string, Content: string){
        this.UserName = UserName
        this.Content = Content
    }

    public GetUserName(): string{
        return this.UserName
    }

    public GetContent(): string{
        return this.Content
    }

}
