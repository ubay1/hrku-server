import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants/constant';
import {uid} from 'rand-token'
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor( 
    // depedency injection
    private userService: UserService,
    private jwtService: JwtService,
  ){}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email)

    if(!user) {
      return null;
    }

    const isMatching = await bcrypt.compare(password, user.password)
    if (user && isMatching) {
      const {password, ...result} = user;
      return result;
    } else {
      return null;
    }
  }

  async userLogin(user: any) {
    // console.log(user)
    const payload = { email: user.email, sub: user.id };
    
    if (user.role.slug_role_name !== 'hrd') {
      return {
        statusCode: 403,
        message: 'anda tidak mendapatkan akses, anda bukan HRD'
      }
    }
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user.email)
    };
  }

  async decodeToken(token: any) {
    return this.jwtService.verify(token, jwtConstants.secret);
  }

  async generateRefreshToken(email):  Promise<string>{
    var refreshToken = uid(32);
    var expirydate = moment().add(14, 'days').format('YYYY-MM-DD HH:mm:ss');
    await this.userService.saveorupdateRefreshToken(refreshToken, email, expirydate);
    return refreshToken
  }
}
