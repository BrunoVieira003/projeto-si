import { IsString, IsArray, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBreachDto {
  @ApiProperty({
    description: 'Descrição do incidente de vazamento de dados',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'IDs dos usuários afetados pelo incidente',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  affectedUserIds: string[]; 
}
