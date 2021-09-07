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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
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

  async getProfil(data: any) {
    const token = await data;
    // console.log(token)
    const user = await this.userRepository.createQueryBuilder('user')
    .where("user.email = :email",{email: token.email})
    .leftJoinAndSelect("user.role", "role")
    .select(['user.fullname', 'user.address', 'user.phone', 'user.foto', 'user.gender', 'user.email', 'role.role_name', 'role.slug_role_name'])
    .getOne();
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('user')
    .where("user.id = :id",{id: id})
    .leftJoinAndSelect("user.role", "role")
    .select(['user', 'role.role_name', 'role.slug_role_name'])
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
    const cekPhone = await this.userRepository.find({where: {phone: data.phone}})

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
        statusCode: 500,
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
        statusCode: 500,
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
}
