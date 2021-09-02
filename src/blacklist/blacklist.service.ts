import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Blacklist } from './entities/blacklist.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/constants/constant';
import { decode } from 'punycode';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(Blacklist) private blacklistRepository: Repository<Blacklist>
  ) {}

  async findOne(data: any) {
    const checkBlackList = await this.blacklistRepository.findOne({where: {token: data}})
    return checkBlackList
  }

  async logout(data: any) {
    // console.log(data)
    const token = await this.blacklistRepository.create({
      token: data
    })
    await this.blacklistRepository.save(token)
    return {
      message: 'logout sukses'
    };
  }
}