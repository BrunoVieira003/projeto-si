import { ApiTags } from "@nestjs/swagger";
import { UserTermAcceptanceEntity } from "src/modules/acceptance/entities/user-term-acceptance.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { TermCustomFieldEntity } from "./term-custom-field.entity";

@ApiTags("terms")
@Entity({ name: "terms" })
export class TermEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({})
  title: string;

  @Column("text")
  content: string;

  @Column("text")
  createdBy: string;

  @Column({ type: 'int' })
  version: number;

  @Column({ name: "is_active", default: false })
  isActive: boolean;

  @OneToMany(() => UserTermAcceptanceEntity, (uta) => uta.term)
  acceptances: UserTermAcceptanceEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => TermCustomFieldEntity, (field) => field.term, { cascade: true, eager: true })
  customFields: TermCustomFieldEntity[];
}
