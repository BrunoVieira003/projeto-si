import { UserEntity } from "src/modules/user/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('integrations')
export class IntegrationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    token: string

    @ManyToOne(() => UserEntity, (u) => u.integrations)
    user: UserEntity
}
