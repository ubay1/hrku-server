import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, HttpStatus, UseGuards, HttpException, Req, Request, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { AuthLoginUserDto } from 'src/auth/dto/auth-login-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { editFileName, imageFileFilter } from './validation/uploadFoto';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Create Data User'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async create(@Body() data: CreateUserDto, @Res() res: any) {
    const user = await  this.userService.create(data);
    if (typeof(user.data) === 'undefined') {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else {
      return res.status(HttpStatus.CREATED).json(user)
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({summary: 'Login User'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async login(@Request() req: any, @Body() dataUser: AuthLoginUserDto) {
    return this.authService.userLogin(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Logout User'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async logout(@Request() req: any,) {
    const token = await req.headers.authorization.replace('Bearer ', '')
    return this.blacklistService.logout(token)
    // return saveTokenBlackList;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Get All User'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async findAll() {
    const user = await this.userService.findAll();
    return {
      message: 'sukses mendapatkan data semua user',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profil')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Get Profil Auth'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async getProfil(@Request() req: any,) {
    const token = req.headers.authorization.replace('Bearer ', '')
    const decodedToken = this.authService.decodeToken(token)
    const user = await this.userService.getProfil(decodedToken);
    return {
      message: 'sukses mendapatkan data semua user',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateFotoProfil')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: editFileName
    }),
    fileFilter: imageFileFilter
  }))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Update Foto Profil'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async updateFotoProfil(@UploadedFile() file: Express.Multer.File,@Req() req: any, @Res() res: any) {
    
    if (file === undefined) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'harap masukan gambarnya'
      });
    } else {
      // const response = {
      //   originalname: file.originalname,
      //   filename: file.filename,
      // };
      const token = await req.headers.authorization.replace('Bearer ', '')
      const decodedToken = await this.authService.decodeToken(token)
      const a = await this.userService.updateFotoProfil(decodedToken.email, file.filename)
      // console.log(a)
      return res.status(HttpStatus.CREATED).json({
        message: 'gambar berhasil dikirim'
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateProfil')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Update Profil'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async updateProfil(@Body() data: UpdateUserDto, @Req() req: any, @Res() res: any) {
    const token = await req.headers.authorization.replace('Bearer ', '')
    const decodedToken = await this.authService.decodeToken(token)
    // console.log(decodedToken)
    const user = await  this.userService.updateProfil(decodedToken.email, data);
    console.log(user)
    if (typeof(user) === undefined || user.statusCode === 403) {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else if(user.statusCode === 500) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else {
      return res.status(HttpStatus.CREATED).json(user)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Get User By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    return {
      message: 'sukses mendapatkan data user',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Update User By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const role = this.userService.update(id, updateUserDto);
    return role;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Delete User By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async remove(@Param('id') id: number) {
    const user = await this.userService.remove(id);
    return user;
  }
}
