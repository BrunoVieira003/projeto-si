import { PartialType } from '@nestjs/swagger';
import { CreateIntegrationOrgDto } from './create-integration-org.dto';
import { Status } from '../enums/status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateIntegrationRequestDto extends PartialType(CreateIntegrationOrgDto) {
    @IsOptional()
    @IsEnum(Status)
    status?: Status
}
