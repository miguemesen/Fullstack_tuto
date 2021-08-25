import { Post } from "../entities/Post";
import {Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, FieldResolver, Resolver, Root, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";


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
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number, 
    @Arg("value", () => Int) value: number, 
    @Ctx() { req }: MyContext) {
      const isUpdoot = value !== -1;
      const realValue = isUpdoot ? 1 : -1;
      const { userId } = req.session;
      // await Updoot.insert({
      //   userId,
      //   postId,
      //   value: realValue 
      // });

      await getConnection().query(
        `
      START TRANSACTION;
      insert into updoot ("userId", "postId", value)
      values (${userId},${postId},${realValue});
      update post 
      set points = points + ${realValue}
      where id = ${postId};

      COMMIT;
      `
      );
      return true;
    }

  @Query(() => PaginatedPosts) // Queries are for getting data
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit) + 1;
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    const posts = await getConnection().query(
      `
    select p.*, 
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updateAt', u."updateAt"
      ) creator
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true }) // returns a post OR null
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post) // Mutations are for updating, inserting and deleting, anything that changes things on the server
  @UseMiddleware(isAuth) // Runs before the resolver
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string // for a possible null we must specify the type
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