import { IsOptional, IsString } from "class-validator";

export class CreatePasswordDto {
    @IsString()
    websiteUrl: string;

    @IsString()
    @IsOptional()
    userName: string;

    @IsString()
    password: string;
}
