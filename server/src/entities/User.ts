import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Post } from "./Post";

@ObjectType() // Converting class object to graphql type
@Entity() // Tells MikrOrm that this is an entity and corresponds to a db table
export class User extends BaseEntity{
    @Field() // Added field as part of converting class object to graphql type
    @PrimaryGeneratedColumn()
    id!: number;

    @Field() // You can remove the field to not expose on graphql
    @Column({unique: true})
    username!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @Field(() => String)
    @CreateDateColumn() // Columns
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updateAt: Date;
}