import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Role } from './role/entities/role.entity'
import { User } from './user/entities/user.entity'
import * as moment from "moment";
import * as bcrypt from 'bcrypt';

export class SEEDDATA1638138440301 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dataRole = getRepository(Role).create({
      role_name: 'HRD',
      slug_role_name: 'hrd',
    });

    await getRepository(Role).save(dataRole);

    // create user
    const hashedPassword = await bcrypt.hash('123', 10)
    const dataUserDefault = getRepository(User).create({
      roleId: dataRole.id,
      fullname: 'mutiara fatichah',
      address: 'Taman Wisma Asri 2, Blok AA 18 No 32 RT 007 RW 022, Bekasi Utara - Bekasi',
      phone: '089653674186',
      email: 'mutiarafatichah22@gmail.com',
      password: hashedPassword,
      no_rekening: '',
      no_bpjs: '',
    });

    await getRepository(User).save(dataUserDefault);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
