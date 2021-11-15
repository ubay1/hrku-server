import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import {Injectable, UnauthorizedException, Body} from '@nestjs/common';
import {UserService} from '../../user/user.service';
import * as moment from 'moment';
import { jwtConstants } from '../constants/constant';
 
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy,"jwt-refreshtoken") {
  constructor(private userService:UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('access_token'),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
      passReqToCallback:true
    });
  }
 
  async validate(req: any, payload: any) {
    
    let user: any = await this.userService.findByEmail(payload.email);
    // console.log('payload = ',payload)
    // console.log('user = ',user)
    // console.log('req = ',req)

    if(!user){
        throw new UnauthorizedException();
    }

    if(req.body.refresh_token !== (await user).refreshtoken){
      throw new UnauthorizedException();
    }
    
    if( moment() > moment((await user).refreshtokenexpires)){
      throw new UnauthorizedException();
    }

    return user;
  }
}