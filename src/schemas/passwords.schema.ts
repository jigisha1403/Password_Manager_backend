import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})

export class Passwords{
    @Prop({required: true})
    websiteUrl: string;

    @Prop({required:true})
    userName: string;

    @Prop({required: true})
    password: string;

    
    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: "AuthS" })
    userId: mongoose.Types.ObjectId;
}

export const passwordsSchema = SchemaFactory.createForClass(Passwords);