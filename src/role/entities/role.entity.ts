import { User } from "src/user/entities/user.entity";
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";

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

    // @OneToMany(() => User, user => user.role)
    // public user: User;
}