import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTermDTO {
  @ApiProperty({ example: 'Termo de Uso', description: 'Título do termo' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Conteúdo completo do termo', description: 'Texto do termo de uso' })
  @IsString()
  content: string;
}
