import { Post } from "../entities/Post";
import {Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, FieldResolver, Resolver, Root, ObjectType } from "type-graphql";
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

@ObjectType()
class PaginatedPosts{  
  @Field(() => [Post])
  posts: Post[]
  @Field()
  hasMore: boolean;
}


@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => String)
  textSnippet(
    @Root() root: Post
  ){
    return root.text.slice(0,50);
  }


  @Query(() => PaginatedPosts) // Queries are for getting data
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, {nullable: true}) cursor: string | null
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50,limit) + 1;
    const realLimitPlusOne = realLimit + 1;
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimitPlusOne)

      if(cursor){
        qb.where('"createdAt" < :cursor', {
          cursor: new Date(parseInt(cursor)),
        });
      }
      const posts = await qb.getMany();
    return {posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne};
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