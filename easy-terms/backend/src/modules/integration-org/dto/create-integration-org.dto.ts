import { IsNotEmpty, IsString } from "class-validator"

export class CreateIntegrationOrgDto {
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsNotEmpty()
    email: string
    
    @IsString()
    @IsNotEmpty()
    website: string
}
