import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class UpdateAcceptedFieldsDTO {
  @ApiProperty({
    example: ['uuid-campo1', 'uuid-campo2'],
    description: 'Lista de IDs dos campos opcionais aceitos pelo usuário',
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  acceptedFieldIds: string[];
}
