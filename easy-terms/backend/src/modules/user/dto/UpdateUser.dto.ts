import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "../enums/role.enum";

export class UpdateUserDTO {
    @IsNotEmpty({ message: "O nome não pode ser vazio" })
    name: string;

    @IsEnum(Role, { message: "O papel deve ser ADMIN ou EMPLOYEE" })
    role: Role;

    @IsOptional()
    acceptedTermIds?: string[];
}

