import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password:string;
}
