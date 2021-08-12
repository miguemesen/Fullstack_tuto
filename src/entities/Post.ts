import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity() // Tells MikrOrm that this is an entity and corresponds to a db table
export class Post {
    @PrimaryKey()
    id!: number;

    @Property({type: "date"}) // Columns
    createdAt = new Date();

    @Property({type: "date", onUpdate: () => new Date()})
    updateAt = new Date();

    @Property({type: "text"})
    title!: string;
}