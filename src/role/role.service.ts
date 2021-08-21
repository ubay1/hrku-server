import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleModule } from './role.module';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async create(data: CreateRoleDto) {
    const role = this.roleRepository.create(data)
    await this.roleRepository.save(data)
    return role; 
  }

  async findAll() {
    const allRole = await this.roleRepository.find()
    return allRole;
  }

  async findOne(id: any) {
    const roleById = await this.roleRepository.findByIds(id)
    return roleById;
  }

  async update(id: number, data: CreateRoleDto) {
    const cekId = await this.findOne(id)
    if(cekId.length !== 0) {
      await this.roleRepository.update({id}, data)
      return {message: 'data sukses diupdate'}
    } else {
      return {message: 'data gagal diupdate'}
    }
  }

  async remove(id: number) {
    const cekId = await this.findOne(id)
    if(cekId.length !== 0) {
      await this.roleRepository.delete({id})
      return {message: 'data sukses dihapus'}
    } else {
      return {message:'data role tidak ditemukan'}
    }
  }
}
