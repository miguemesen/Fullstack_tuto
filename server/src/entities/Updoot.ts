import { Column, CreateDateColumn, Entity, UpdateDateColumn,BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Post } from "./Post";


@Entity() // Tells MikrOrm that this is an entity and corresponds to a db table
export class Updoot extends BaseEntity {


    @Column({type: "int"})
    value: number;


    @PrimaryColumn()
    userId: number;


    @ManyToOne(() => User, user => user.updoots)
    user: User;


    @PrimaryColumn()
    postId: number;


    @ManyToOne(() => Post, (post) => post.updoots)
    post: Post;

}