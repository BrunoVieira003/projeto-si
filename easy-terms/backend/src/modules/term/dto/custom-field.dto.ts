import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class CustomFieldDTO {
  @ApiProperty({ example: 'idadeMinima', description: 'Nome do campo personalizado'})
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome do campo é obrigatório' })
  name: string;

  @ApiProperty({ example: '18', description: 'Valor do campo personalizado'})
  @IsString({ message: 'O valor deve ser uma string' })
  @IsNotEmpty({ message: 'O valor do campo é obrigatório' })
  value: string;

  @ApiProperty({
    example: 'number',
    description: 'Tipo do campo personalizado (string, number, boolean ou date)',
    enum: ['string', 'number', 'boolean', 'date']
  })
  @IsString({ message: 'O tipo deve ser uma string' })
  @IsIn(['string', 'number', 'boolean', 'date'], { message: 'O tipo deve ser um dos seguintes: string, number, boolean ou date'})
  type: 'string' | 'number' | 'boolean' | 'date';
}
