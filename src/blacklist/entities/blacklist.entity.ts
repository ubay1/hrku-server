import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";

@Entity()
export class Blacklist {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    token: string;

    @Column({type: 'timestamptz',default: () => 'CURRENT_TIMESTAMP'})
    created_at: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updated_at: string
}
