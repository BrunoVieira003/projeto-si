import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    cpf: string

    @IsString()
    password: string
}
