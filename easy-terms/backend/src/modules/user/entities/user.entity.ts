import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "../enums/role.enum";
import { UserTermAcceptanceEntity } from "src/modules/acceptance/entities/user-term-acceptance.entity";
import { IntegrationEntity } from "src/modules/integration/entities/integration.entity";

@ApiTags("users")
@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "email", length: 70, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ name: "password", length: 255, nullable: false })
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.EMPLOYEE, nullable: false })
  role: Role;

  @OneToMany(() => UserTermAcceptanceEntity, (uta) => uta.user)
  termAcceptances?: UserTermAcceptanceEntity[];

  @Column({ name: "phone_number", length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'cpf', length: 14, nullable: true, unique: true })
  cpf: string;

  @Column({ name: 'city', length: 100, nullable: true })
  city: string;

  @Column({ name: 'state', length: 2, nullable: true })
  state: string;

  @OneToMany(() => IntegrationEntity, (i) => i.user)
  integrations: IntegrationEntity[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
