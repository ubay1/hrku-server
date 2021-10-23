import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import * as dotenv from 'dotenv'
import { AuthModule } from 'src/auth/auth.module';
import { BlacklistModule } from 'src/blacklist/blacklist.module';
import { MailModule } from 'src/mail/mail.module';
dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => AuthModule),
    forwardRef(() => BlacklistModule),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
