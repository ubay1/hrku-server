import { Role } from "src/role/entities/role.entity";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Role, (role: Role) => role.id, {
      cascade: true,
      eager: true,
    })
    @JoinColumn()
    public role: Role;

    @Column()
    fullname: string;
    @Column()
    address: string;
    @Column()
    phone: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column({nullable: true})
    no_rekening: string;
    @Column({nullable: true})
    no_bpjs: string;

    @Column({type: 'timestamptz'})
    created_at: string

    @Column({type: 'timestamptz'})
    updated_at: string
}
