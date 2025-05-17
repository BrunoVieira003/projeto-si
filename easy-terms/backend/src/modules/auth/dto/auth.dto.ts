import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDTO {
  @ApiProperty({ example: 'abner.rmachado@gmail.com', description: 'E-mail do usuário' })
  @IsString({ message: 'O e-mail deve ser uma string' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail(undefined, { message: "O e-mail informado é inválido" })
  email: string;

  @ApiProperty({ example: 'abner123', description: 'Senha do usuário' })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: "A senha não pode estar vazia" })
  password: string;
}
