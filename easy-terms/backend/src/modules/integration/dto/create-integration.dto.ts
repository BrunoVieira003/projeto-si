import { IsString } from "class-validator";

export class CreateIntegrationDto {
    @IsString()
    name: string
}
