import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor( 
    // depedency injection
    private userService: UserService,
    private jwtService: JwtService
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
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
