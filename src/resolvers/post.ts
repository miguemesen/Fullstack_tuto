import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import {Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";

@Resolver()
export class PostResolver{
    @Query(() => [Post]) // Queries are for getting data
    posts(@Ctx() {em}: MyContext): Promise<Post[]>{
        return em.find(Post,{});
    }

    @Query(() => Post,{nullable:true}) // returns a post OR null
    post(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<Post | null>{
        return em.findOne(Post,{id});
    }

    @Mutation(() => Post) // Mutations are for updating, inserting and deleting, anything that changes things on the server
    async createPost(
        @Arg('title') title: string,
        @Ctx() {em}: MyContext): Promise<Post>{
        const post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(() => Post, {nullable: true}) 
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, {nullable: true}) title: string, // for a possible null we must specify the type
        @Ctx() {em}: MyContext): Promise<Post | null>{
        const post = await em.findOne(Post,{id});
        if (!post){
            return null;
        }
        if (typeof title !== 'undefined'){
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean) 
    async deletePost(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<Boolean>{
            try {
                await em.nativeDelete(Post,{id})
            } catch{
                return false;
            }
            
            return true;
    }
}