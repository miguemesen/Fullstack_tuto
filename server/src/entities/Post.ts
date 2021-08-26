import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Updoot } from "./Updoot";

@ObjectType() // Converting class object to graphql type
@Entity() // Tells MikrOrm that this is an entity and corresponds to a db table
export class Post extends BaseEntity {
    @Field() // Added field as part of converting class object to graphql type
    @PrimaryGeneratedColumn()
    id!: number;

    @Field() // You can remove the field to not expose on graphql
    @Column()
    title!: string;

    @Field() 
    @Column()
    text!: string;

    @Field() 
    @Column({type: "int", default: 0})
    points!: number;

    @Field(() => Int, {nullable: true})
    voteStatus: number | null; // 1 or -1 or null

    @Field()
    @Column()
    creatorId: number;

    @Field()
    @ManyToOne(() => User, user => user.posts)
    creator: User;

    @OneToMany(() => Updoot, (updoot) => updoot.post)
    updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn() // Columns
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updateAt: Date;
}