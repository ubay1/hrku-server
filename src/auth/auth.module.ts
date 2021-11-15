import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy'
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constant';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt.refreshtoken.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule), 
    PassportModule, 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '7d'}
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
