import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    cpf: string
}
