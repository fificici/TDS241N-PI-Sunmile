import { Community } from "./Communitys"
import { SubCommunity } from "./Communitys"
import { Post } from "./Posts"

export class Account {
    name: string
    Description: string
    BirthDate: Date
    Following: Array<Account>
    Followers: Array<Account>
    Subscriptions: Array<Community>
    subSubscriptions: Array<SubCommunity>
    MainLanguage: string

    constructor(ProfileName: string, AccountDescription: string, userage: Date, Following: Array<Account>, Followers: Array<Account>, Subscriptions: Array<any>, subSubscriptions: Array<SubCommunity>, MainLanguage: string){
        this.name = ProfileName
        this.Description = AccountDescription
        this.BirthDate = userage
        this.Following = Following
        this.Followers = Followers
        this.Subscriptions = Subscriptions
        this.subSubscriptions = subSubscriptions
        this.MainLanguage = MainLanguage
    }

    GetnameUser(): string{
        return this.name
    }

    GetDescription(): string{
        return this.Description
    }

    GetIdade(): Date{
        return this.BirthDate
    }

    GetFollowing(): Account[]{
        return this.Following
    }

    GetFollowers(): Account[]{
        return this.Followers
    }

    GetSubscriptions(): Community[] {
        return this.Subscriptions
    }

    GetSubSubscriptions(): SubCommunity[]{
        return this.subSubscriptions
    }

    GetMainLanguage(): string {
        return this.MainLanguage
    }

    SetAccount(ProfileName: string, AccountDescription: string, userage: Date, MainLanguage: string): void{
        this.name = ProfileName
        this.Description = AccountDescription
        this.BirthDate = userage
        this.MainLanguage = MainLanguage
    }

    AlterAccountname(change: string):void{
        this.name = change
    }

    AlterAccountDescription(change: string):void{
        this.Description = change
    }

    AlterAccountLinguaPrincipal(change: string):void{
        this.MainLanguage = change
    }
}
