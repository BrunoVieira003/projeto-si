import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomFieldDTO } from './custom-field.dto';
import { Type } from 'class-transformer';

export class CreateTermDTO {
  @ApiProperty({ example: 'Termo de Uso', description: 'Título do termo' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @ApiProperty({ example: 'Conteúdo completo do termo', description: 'Texto do termo de uso' })
  @IsString()
  @IsNotEmpty({ message: 'O conteúdo do termo é obrigatório' })
  content: string;

  @ApiProperty({ example: 'admin_user_id', description: 'ID do usuário que criou o termo' })
  @IsString()
  @IsNotEmpty({ message: 'O campo createdBy é obrigatório' })
  createdBy: string;

  @ApiPropertyOptional({
    description: 'Campos personalizados opcionais do termo',
    type: [CustomFieldDTO],
  })
  @IsOptional()
  @IsArray({ message: 'customFields deve ser uma lista de objetos' })
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDTO)
  customFields?: CustomFieldDTO[];
}
