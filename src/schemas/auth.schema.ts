import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})

export class AuthS{
    @Prop({required: true})
    name: string;

    @Prop({required:true, unique: true})
    email: string;

    @Prop({required:true})
    password: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthS)