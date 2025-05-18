import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TermEntity } from "./term.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("term_custom_fields")
@Entity({ name: "term_custom_fields" })
export class TermCustomFieldEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string; // Ex: "campoExtra1", "tipoDocumento", etc

  @Column("text", { nullable: true })
  value: string; // Valor informado (pode ser convertido para outro tipo no frontend)

  @Column({ default: "string" })
  type: "string" | "number" | "boolean" | "date"; // Tipo opcional do campo (usado no frontend)

  @ManyToOne(() => TermEntity, (term) => term.customFields, { onDelete: 'CASCADE' })
  term: TermEntity;
}
