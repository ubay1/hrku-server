import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  
  async create(data: CreateUserDto) {
    const user = await this.userRepository.create(data)
    this.userRepository.save(data)
    return user;
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
