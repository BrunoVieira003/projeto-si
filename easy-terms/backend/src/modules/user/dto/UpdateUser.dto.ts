import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDTO {
    @ApiProperty({ example: 'Abner Douglas', description: 'Nome do usuário' })
    @IsNotEmpty({ message: "O nome não pode ser vazio" })
    name: string;

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
}

