import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from 'src/role/entities/role.entity';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/constants/constant';
import { decode } from 'punycode';
import { UpdateFotoUserDto } from './dto/update-foto-user.dto';
import * as fs from "fs-extra";
import { ForgotPasswordUserDto } from './dto/forgot-password-user';
import { MailService } from 'src/mail/mail.service';
import * as moment from 'moment';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { OtpUserDto } from './dto/otp-user';
import { ResetPasswordUserDto } from './dto/reset-password-user';
import { CheckResetPasswordUserDto } from './dto/check-reset-password';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';


const algorithm = 'aes-256-ctr'
const iv = randomBytes(16);
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const password = 'llakcolnu';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly mailService: MailService
  ) {}

  async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({where: {email: email}})
    return user;
  }
  
  async create(data: CreateUserDto) {
    try {
      const cekRole = await this.roleRepository.find({where: {id: data.roleId}})
      const cekEmail = await this.userRepository.find({where: {email: data.email}})
      const cekPhone = await this.userRepository.find({where: {phone: data.phone}})
      
      if (cekRole.length === 0) {
        return {
          message: 'role tidak terdaftar',
        }
      } else {
        if (cekEmail.length !== 0) {
          return {
            message: 'email telah digunakan user lain',
          }
        } else {
          if (cekPhone.length !== 0) {
            return {
              message: 'nomor telepon telah digunakan user lain',
            }
          } else {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.userRepository.create({
              ...data,
              password: hashedPassword
            });
            await this.userRepository.save(user)
            user.password = undefined;
            
            return {
              message: 'sukses membuat user',
              data: user
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async findAll() {
    const allUser = await this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect("user.role", "role")
    .select(['user', 'role.role_name', 'role.slug_role_name'])
    .getMany();
    return allUser;
  }

  async paginateFindAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const allUser = await this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect("user.role", "role")
    .select(['user', 'role.role_name', 'role.slug_role_name'])

    return paginate<User>(allUser, options);
  }

  async getProfil(data: any) {
    const token = await data;
    // console.log(token)
    const user = await this.userRepository.createQueryBuilder('user')
    .where("user.email = :email",{email: token.email})
    .leftJoinAndSelect("user.role", "role")
    .select(['user.fullname', 'user.address', 'user.phone', 'user.foto', 'user.gender', 'user.email', 'user.no_rekening', 'user.no_bpjs', 'role.id', 'role.role_name', 'role.slug_role_name'])
    .getOne();
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('user')
    .where("user.id = :id",{id: id})
    .leftJoinAndSelect("user.role", "role")
    .select(['user', 'role.role_name', 'role.slug_role_name', 'refreshtoken','refreshtokenexpires'])
    .getMany();
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const cekId = await this.findOne(id)
    if(cekId.length !== 0) {
      await this.userRepository.update({id}, data);
      return {message: 'data sukses diupdate'}
    } else {
      return {message: 'data gagal diupdate'}
    }
  }

  async updateProfil(email: string, data: UpdateUserDto) {
    const cekId = await this.findByEmail(email)
    const cekPhone = await this.userRepository.find({where: {phone: data.phone, email: !email}})
    console.log(cekPhone)
    
    if (cekPhone.length !== 0) {
      return {
        statusCode: 403,
        message: 'nomor telepon telah digunakan user lain',
      }
    }

    if(cekId.length !== 0) {
      await this.userRepository.update({email}, data);
      return {
        statusCode: 201,
        message: 'data sukses diupdate'
      }
    } else {
      return {
        statusCode: 400,
        message: 'data gagal diupdate'
      }
    }
  }

  async updateFotoProfil(email: string, foto: UpdateFotoUserDto | any) {
    // console.log(email)
    const cekId = await this.findByEmail(email)
    if(cekId.length !== 0) {
      const updatePicture = await this.changePicture(foto, email)
      if (updatePicture.status === 400) {
        return {
          statusCode: 400,
          message: 'gagal upload foto'
        }
      } else if (updatePicture.status === 403) {
        return {
          statusCode: 403,
          message: 'File harus bertipe JPG/JPEG/PNG'
        }
      } else {
        this.userRepository.update({email}, {foto: updatePicture.pict_name});
        return {
          statusCode: 201,
          message: 'foto sukses diupdate'
        }
      }
    } else {
      return {
        statusCode: 400,
        message: 'foto gagal diupdate'
      }
    }
  }

  async changePicture( base64: string, email: string): Promise<any> {
    let pict_name: any;
    pict_name = email;
    let photo_file = "avatar_" + pict_name + ".png";
    const rootDir = process.cwd();
    let next_path = "/storage/avatar/";
    let photo_path = photo_file;
    let base64Image = base64.split(";base64,").pop();
    let base64Type = base64.split(";base64,", 1).pop();
    let location = rootDir + next_path + photo_file
    if (base64Type === "data:image/jpeg" || base64Type === "data:image/jpg" || base64Type === "data:image/png") {
      try {
        fs.writeFile(location, base64Image, { encoding: "base64" }, function (err) {
          console.log("File created");
        });
        return {
          statusCode: 200,
          message: "file created",
          pict_name: photo_file
        }
      } catch (error) {
        return {
          statusCode: 400,
          message: "Failed Create File"
        }
      }
    } else {
      return {
        status: 403,
        message: "Not Base64"
      }
    }
  }

  async remove(id: number) {
    const cekId = await this.findOne(id)
    if(cekId.length !== 0) {
      await this.userRepository.delete({id})
      return {message: 'data sukses dihapus'}
    } else {
      return {message:'data user tidak ditemukan'}
    }
  }

  async forgotPassword(data: ForgotPasswordUserDto) {
    const dataUser = await this.findByEmail(data.email)

    if (dataUser.role.slug_role_name !== 'hrd') {
      return {
        statusCode: 403,
        message: 'anda tidak mendapatkan akses, anda bukan HRD'
      }
    }
    
    if (dataUser.length !== 0) {
      var randomFixedInteger = function (length: number) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
      }
      
      const dataToken = {
        otp: randomFixedInteger(6).toString(),
        exp: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
      }
      

      const cipher = createCipheriv(algorithm, secretKey, iv);
      const encryptedText = Buffer.concat([
        cipher.update(JSON.stringify(dataToken)),
        cipher.final(),
      ]);

      const stringifyDataEncrypt = JSON.stringify({
        iv: iv.toString('hex'),
        content: encryptedText.toString('hex')
      })

        
      // console.log(iv.toString('hex'))
      // console.log(encryptedText.toString('hex'))
        
      await this.userRepository.update(dataUser.id, { reset_password_token: stringifyDataEncrypt});
      await this.mailService.codeForgotpassword(dataUser, dataToken);

      return {
        statusCode: 200,
        message: 'email sukses dikirim'
      }
    } else {
      return {
        statusCode: 400,
        message: 'email gagal dikirim'
      }
    }
  }

  async verifOtp(data: OtpUserDto) {
    const dataUser = await this.findByEmail(data.email)

    if (dataUser.length !== 0) {
      const chiperr = dataUser.reset_password_token
  
      const parse = JSON.parse(chiperr)

      // console.log(parse)
      
      const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(parse.iv.toString('hex'), 'hex'));
      
      const decrpyted = Buffer.concat([decipher.update(Buffer.from(parse.content.toString('hex'), 'hex')), decipher.final()]);
      
      const getParseDataReset = JSON.parse(decrpyted.toString())

      if (data.otp !== getParseDataReset.otp) {
        return {
          statusCode: 400,
          message: 'OTP yang anda masukan tidak sesuai'
        }
      }

      if (moment(getParseDataReset.exp).format('YYYY-MM-DD HH:mm:ss') < moment().format('YYYY-MM-DD HH:mm:ss')) {
        return {
          statusCode: 403,
          message: 'otp telah kadaluarsa, silahkan kirim ulang'
        }
      }
      
      return {
        statusCode: 200,
        message: 'verif sukses'
      }
    }
    
  }

  async resetPassword(data: ResetPasswordUserDto) {
    const dataUser = await this.findByEmail(data.email)

    if (dataUser.length !== 0) {
      const hashedPassword = await bcrypt.hash(data.new_password, 10);
      await this.userRepository.update(dataUser.id, {password: hashedPassword, reset_password_token: null});
      
      return {
        statusCode: 200,
        message: 'pasword berhasil diubah',
      }
    } else {
      return {
        statusCode: 400,
        message: 'data user tidak ditemukan',
      }
    }

  }

  async checkResetPassword(data: CheckResetPasswordUserDto) {
    const dataUser = await this.findByEmail(data.email)
    
    if (dataUser.reset_password_token !== null) {
      return {
        statusCode: 200,
        message: 'reset password token masih aktif',
        data: dataUser
      }
    } else {
      return {
        statusCode: 403,
        message: 'reset password token sudah tidak aktif',
      }
    }

  }

  async saveorupdateRefreshToken( refreshToken:string, email:string, refreshtokenexpires: any){
    await this.userRepository.update({email}, {refreshtoken:refreshToken, refreshtokenexpires: refreshtokenexpires});
  }
}
