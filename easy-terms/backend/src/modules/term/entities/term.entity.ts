import { ApiTags } from "@nestjs/swagger";
import { UserTermAcceptanceEntity } from "src/modules/acceptance/entities/user-term-acceptance.entity";
import { Role } from "src/modules/user/enums/role.enum";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";

@ApiTags("terms")
@Entity({ name: "terms" })
export class TermEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({})
  title: string;

  @Column("text")
  content: string;

  @Column({ default: true })
  revocable: boolean

  @Column("text")
  purpose: string;

  @Column("text")
  createdBy: string; 

  @Column({ nullable: true })
  appliesToRoles: Role
  
  @Column({ nullable: true })
  validFrom: Date;

  @Column({ nullable: true })
  validUntil: Date;

  @Column({ nullable: true})
  acceptanceRequired: boolean;

  @Column({ type: 'int' })
  version: number;

  @Column({ name: "is_active", default: false })
  isActive: boolean;

  @OneToMany(() => UserTermAcceptanceEntity, (uta) => uta.term)
  acceptances: UserTermAcceptanceEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
