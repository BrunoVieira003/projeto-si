import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { UserTermAcceptanceEntity } from './user-term-acceptance.entity';
import { TermCustomFieldEntity } from 'src/modules/term/entities/term-custom-field.entity';


@Entity({ name: 'user_accepted_custom_fields' })
export class UserAcceptedCustomFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserTermAcceptanceEntity, (acceptance) => acceptance.acceptedCustomFields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_term_acceptance_id' })
  userTermAcceptance: UserTermAcceptanceEntity;

  @ManyToOne(() => TermCustomFieldEntity, { eager: true, onDelete: 'CASCADE' })
  customField: TermCustomFieldEntity;

  @Column({ default: true })
  accepted: boolean;

  @CreateDateColumn({ type: 'timestamp',nullable: true })
  acceptedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;
}
