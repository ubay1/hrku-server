import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { BlacklistService } from './blacklist/blacklist.service';
import { Role } from './role/entities/role.entity';
import { User } from './user/entities/user.entity';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly blacklistService: BlacklistService,
    private readonly authService: AuthService,
  ) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '')
      const checkBlackList = await this.blacklistService.findOne(token);
      if (checkBlackList) {
        return res.status(401).send({
          auth: false,
          message: 'token telah diblacklist, silahkan login kembali.'
        })
      } 
      // else {
      //   const decodeToken = await this.authService.decodeToken(token)
      //   console.log('decode token = ',decodeToken)
      // }
    }
    next();
  }
}
