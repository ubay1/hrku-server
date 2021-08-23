import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {}

  async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({where: {email: email}})
    return user;
  }
  
  async create(data: CreateUserDto) {
    try {
      const cekRole = await this.roleRepository.find({where: {id: data.roleId}})
      const cekEmail = await this.userRepository.find({where: {email: data.email}})
      const cekPhone = await this.userRepository.find({where: {phone: data.phone}})
      
      if (cekRole.length === 0) {
        return {
          message: 'role tidak terdaftar',
        }
      } else {
        if (cekEmail.length !== 0) {
          return {
            message: 'email telah digunakan user lain',
          }
        } else {
          if (cekPhone.length !== 0) {
            return {
              message: 'nomor telepon telah digunakan user lain',
            }
          } else {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.userRepository.create({
              ...data,
              password: hashedPassword
            });
            await this.userRepository.save(user)
            user.password = undefined;
            
            return {
              message: 'sukses membuat user',
              data: user
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async login(data: LoginUserDto) {
    try {
      const dataUser = await this.userRepository.findOne({where: {email: data.email}})
      if (dataUser === undefined) {
        return {
          message: 'user tidak terdaftar',
        }
      }
      
      const isPasswordMatching = await bcrypt.compare(data.password, dataUser.password)
      if (!isPasswordMatching){
        return {
          message: 'password tidak sesuai',
        }
      }

      // const hashedPassword = await bcrypt.hash(data.password, 10);
      // console.log(hashedPassword)
      // const user = await this.userRepository.create({
      //   ...data,
      //   password: hashedPassword
      // });
      // await this.userRepository.save(user)
      // user.password = undefined;
      return {
        message: 'berhasil login',
        data: dataUser
      }

    } catch (error) {
      console.log(error)
    }
  }

  async findAll() {
    const allUser = await this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect("user.role", "role")
    .select(['user', 'role.role_name', 'role.slug_role_name'])
    .getMany();
    return allUser;
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('user')
    .where("user.id = :id",{id: id})
    .leftJoinAndSelect("user.role", "role")
    .select(['user', 'role.role_name', 'role.slug_role_name'])
    .getMany();
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const cekId = await this.findOne(id)
    if(cekId.length !== 0) {
      await this.userRepository.update({id}, data);
      return {message: 'data sukses diupdate'}
    } else {
      return {message: 'data gagal diupdate'}
    }
  }

  async remove(id: number) {
    const cekId = await this.findOne(id)
    if(cekId.length !== 0) {
      await this.userRepository.delete({id})
      return {message: 'data sukses dihapus'}
    } else {
      return {message:'data user tidak ditemukan'}
    }
  }
}
