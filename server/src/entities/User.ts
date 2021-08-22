import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() // Converting class object to graphql type
@Entity() // Tells MikrOrm that this is an entity and corresponds to a db table
export class User {
    @Field() // Added field as part of converting class object to graphql type
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: "date"}) // Columns
    createdAt = new Date();

    @Field(() => String)
    @Property({type: "date", onUpdate: () => new Date()})
    updateAt = new Date();

    @Field() // You can remove the field to not expose on graphql
    @Property({type: "text", unique: true})
    username!: string;

    @Field()
    @Property({type: "text", unique: true})
    email!: string;

    @Property({type: "text"})
    password!: string;
}