import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enums/status.enum";

@Entity()
export class IntegrationOrg {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    website: string

    @Column({unique: true})
    email: string

    @Column({type: 'enum', enum: Status, default: Status.PENDING})
    status: Status
}
