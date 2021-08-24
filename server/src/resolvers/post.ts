import { Post } from "../entities/Post";
import {Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int } from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput{
  @Field()
  title: string
  @Field()
  text: string
}

export class PostResolver {
  @Query(() => [Post]) // Queries are for getting data
  posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, {nullable: true}) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50,limit);
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit)

      if(cursor){
        qb.where('"createdAt" < :cursor', {
          cursor: new Date(parseInt(cursor)),
        });
      }
    return qb.getMany();
  }

  @Query(() => Post, { nullable: true }) // returns a post OR null
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post) // Mutations are for updating, inserting and deleting, anything that changes things on the server
  @UseMiddleware(isAuth)// Runs before the resolver
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() {req}: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string, // for a possible null we must specify the type
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}