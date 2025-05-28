import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, JoinColumn, OneToMany } from "typeorm";
import { TermEntity } from "src/modules/term/entities/term.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { UserAcceptedCustomFieldEntity } from "./user-accepted-custom-fields.entity";

@Entity({ name: "user_term_acceptances" })
export class UserTermAcceptanceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "term_id" })
  termId: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => TermEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: "term_id" })
  term: TermEntity;

  @OneToMany(() => UserAcceptedCustomFieldEntity, (field) => field.userTermAcceptance, { cascade: true })
  acceptedCustomFields: UserAcceptedCustomFieldEntity[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;
}