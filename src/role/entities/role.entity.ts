import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    role_name: string;

    @Column()
    slug_role_name: string;

    @Column({type: 'timestamptz',default: () => 'CURRENT_TIMESTAMP'})
    created_at: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updated_at: string
}