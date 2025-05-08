import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity()
export class BreachIncident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  affectedUsers: UserEntity[];
}
