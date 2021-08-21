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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
