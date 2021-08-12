import {Resolver, Mutation } from "type-graphql";

@Resolver()
export class UserResolver{
    @Mutation(() => String)
    register(){
        return "hello world"
    }
}