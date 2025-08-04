import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})

export class Passwords{
    @Prop({required: true})
    websiteUrl: string;

    @Prop({required:true})
    userName: string;

    @Prop({required: true})
    password: string;
}

export const passwordsSchema = SchemaFactory.createForClass(Passwords);