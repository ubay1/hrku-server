import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy'
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constant';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt.refreshtoken.strategy';
import { BasicStrategy } from './strategy/auth-basic.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UserModule), 
    PassportModule, 
    ConfigModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '7d'}
    })
  ],
  providers: [AuthService, BasicStrategy, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
