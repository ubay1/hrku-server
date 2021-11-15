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
    @JoinColumn({name: 'roleId'})
    public role: Role;

    @Column()
    public roleId: number;

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
    @Column({nullable: true})
    foto: string;
    @Column({length: 1, nullable: true, type: 'char'})
    gender: string;
    @Column({nullable: true})
    reset_password_token: string;
    @Column({nullable: true})
    refreshtoken:string;
    @Column({type: 'timestamptz', nullable: true})
    refreshtokenexpires:string;

    @Column({type: 'timestamptz',default: () => 'CURRENT_TIMESTAMP'})
    created_at: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updated_at: string
}
