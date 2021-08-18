import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    role_name: string;

    @Column()
    slug_role_name: string;

    @Column({type: 'timestamptz'})
    created_at: string

    @Column({type: 'timestamptz'})
    updated_at: string
}