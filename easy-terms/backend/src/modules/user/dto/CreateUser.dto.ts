import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsDateString,
} from "class-validator";
import { UniqueEmail } from "../validation/UniqueEmail.validation";
import { Role } from "../enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty({ example: 'Abner Douglas', description: 'Nome do usuário' })
  @IsNotEmpty({ message: "O nome não pode ser vazio" })
  name: string;

  @ApiProperty({ example: 'abner.rmachado@gmail.com', description: 'E-mail do usuário' })
  @IsEmail(undefined, { message: "O e-mail informado é inválido" })
  @UniqueEmail({ message: "Já existe um usuário com este e-mail" })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Senha do usuário', minLength: 6 })
  @MinLength(6, { message: "A senha precisa ter pelo menos 6 caracteres" })
  password: string;

  @ApiProperty({ example: Role.EMPLOYEE, description: 'Papel do usuário', enum: Role })
  @IsEnum(Role, { message: "O papel deve ser um dos seguintes: ADMIN, EMPLOYEE" })
  @IsNotEmpty({ message: "O papel não pode estar vazio" })
  role: Role;

  @ApiProperty({ example: '(11) 91234-5678', description: 'Telefone do usuário', required: false })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: '1995-05-10', description: 'Data de nascimento', required: false })
  @IsOptional()
  @IsDateString({}, { message: "A data de nascimento deve estar no formato ISO (yyyy-MM-dd)" })
  birthDate?: Date;

  @ApiProperty({ example: '123.456.789-09', description: 'CPF do usuário', required: false })
  @IsOptional()
  cpf?: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade do usuário', required: false })
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'SP', description: 'Estado do usuário (sigla)', required: false })
  @IsOptional()
  state?: string;

  @ApiProperty({ example: "[\"termId1\", \"termId2\"]", description: 'IDs dos termos que o usuário aceitou', required: false })
  @IsOptional()
  acceptedTermIds?: string[];

  @ApiProperty({ example: "[\"fieldTermId1\", \"fieldTermId2\"]", description: 'IDs dos campos opcionais dos termos que o usuário aceitou', required: false })
  @IsOptional()
  acceptedFieldIds?: string[];
}
