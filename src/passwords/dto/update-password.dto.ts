import { IsString, IsOptional } from "class-validator";

export class UpdatePasswordDto{
    @IsString()
    @IsOptional()
    websiteUrl: string;

    @IsString()
    @IsOptional()
    userName: string;

    @IsString()
    password: string;
}