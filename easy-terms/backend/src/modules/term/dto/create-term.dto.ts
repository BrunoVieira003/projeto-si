import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/user/enums/role.enum';

export class CreateTermDTO {
  @ApiProperty({ example: 'Termo de Uso', description: 'Título do termo' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @ApiProperty({ example: 'Conteúdo completo do termo', description: 'Texto do termo de uso' })
  @IsString()
  @IsNotEmpty({ message: 'O conteúdo do termo é obrigatório' })
  content: string;

  @ApiProperty({ example: true, description: 'Se o termo pode ser revogado', default: true })
  @IsBoolean()
  revocable: boolean;

  @ApiProperty({ example: 'Permitir uso de dados para comunicações', description: 'Finalidade do termo' })
  @IsString()
  @IsNotEmpty({ message: 'A finalidade do termo é obrigatória' })
  purpose: string;

  @ApiProperty({ example: 'admin_user_id', description: 'ID do usuário que criou o termo' })
  @IsString()
  @IsNotEmpty({ message: 'O campo createdBy é obrigatório' })
  createdBy: string;

  @ApiProperty({ example: Role.EMPLOYEE, description: 'Função à qual o termo se aplica', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role, { message: 'O valor deve ser uma função válida (ADMIN ou EMPLOYEE)' })
  appliesToRoles?: Role;

  @ApiProperty({ example: '2025-01-01', description: 'Data de início de vigência do termo', required: false })
  @IsOptional()
  @IsDateString(undefined, { message: 'validFrom deve estar em formato ISO (yyyy-MM-dd)' })
  validFrom?: Date;

  @ApiProperty({ example: '2025-12-31', description: 'Data de expiração do termo', required: false })
  @IsOptional()
  @IsDateString( undefined, { message: 'validUntil deve estar em formato ISO (yyyy-MM-dd)' })
  validUntil?: Date;

  @ApiProperty({ example: true, description: 'Se o aceite é obrigatório para continuar usando o sistema', required: false })
  @IsOptional()
  @IsBoolean()
  acceptanceRequired?: boolean;
}
