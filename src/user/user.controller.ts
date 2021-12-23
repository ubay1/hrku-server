import { Controller, Get, Post, Body, Param, Delete, Put, Res, HttpStatus, UseGuards, Req, Request, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiBasicAuth, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { AuthLoginUserDto } from 'src/auth/dto/auth-login-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { UpdateFotoUserDto } from './dto/update-foto-user.dto';
import { ForgotPasswordUserDto } from './dto/forgot-password-user';
import { OtpUserDto } from './dto/otp-user';
import { ResetPasswordUserDto } from './dto/reset-password-user';
import { CheckResetPasswordUserDto } from './dto/check-reset-password';
import { JwtRefreshAuthGuard } from 'src/auth/guard/jwt-refresh-auth.guard';
import { BasicAuthGuard } from 'src/auth/guard/basic-auth.guard';
import { RefreshTokenUserDto } from 'src/auth/dto/referesh-token.dto';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService,
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
  async login(@Request() req: any, @Body() dataUser: AuthLoginUserDto, @Res() res:any) {
    const user = await this.authService.userLogin(req.user)

    if (typeof (user) === undefined || user.statusCode === 403) {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else if (user.statusCode === 401) {
      return res.status(HttpStatus.UNAUTHORIZED).json(user);
    } else {
      return res.status(HttpStatus.CREATED).json(user)
    }
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
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<any> {
    limit = limit > 100 ? 100 : limit;
    const data = await this.userService.paginateFindAll(
      {
        page,
        limit,
        route: process.env.URL+process.env.API_PREFIX,
      }
    );

    return {
      message: 'sukses mendapatkan data user',
      data: data
    }
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
      message: 'sukses mendapatkan data user',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateFotoProfil')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Update Foto Profil'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async updateFotoProfil(@Body() data: UpdateFotoUserDto, @Req() req: any, @Res() res: any) {
    
    if (data.foto === undefined) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'harap masukan gambarnya'
      });
    } else {
      const token = await req.headers.authorization.replace('Bearer ', '')
      const decodedToken = await this.authService.decodeToken(token)
      const a = await this.userService.updateFotoProfil(decodedToken.email, data.foto)
      // console.log(a)
      return res.status(HttpStatus.CREATED).json(a);
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
    } else if(user.statusCode === 540) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else if(user.statusCode === 540) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(user);
    } else {
      return res.status(HttpStatus.CREATED).json(user)
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post('/forgotPassword')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Forgot Password with (basic-auth)' })
  @ApiOkResponse({ description: 'Sukses' })
  @ApiInternalServerErrorResponse({ description: 'Terjadi kesalahan dari server' })
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai' })
  @ApiForbiddenResponse({ description: 'Gagal' })
  async forgotPassword(@Body() data: ForgotPasswordUserDto, @Res() res: any) {
    const user = await this.userService.forgotPassword(data);
    // console.log(user)
    if (typeof (user) === undefined || user.statusCode === 403) {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else if (user.statusCode === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else if (user.statusCode === 500) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else {
      return res.status(HttpStatus.OK).json(user)
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post('/verifOtp')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Verif OTP with (basic-auth)' })
  @ApiOkResponse({ description: 'Sukses' })
  @ApiInternalServerErrorResponse({ description: 'Terjadi kesalahan dari server' })
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai' })
  @ApiForbiddenResponse({ description: 'Gagal' })
  async verifOtp(@Body() data: OtpUserDto, @Res() res: any) {
    const user = await this.userService.verifOtp(data);
    // console.log(user)
    if (typeof (user) === undefined || user.statusCode === 403) {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else if (user.statusCode === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else if (user.statusCode === 500) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else {
      return res.status(HttpStatus.OK).json(user)
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post('/resetPassword')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Reset Password with (basic-auth)' })
  @ApiOkResponse({ description: 'Sukses' })
  @ApiInternalServerErrorResponse({ description: 'Terjadi kesalahan dari server' })
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai' })
  @ApiForbiddenResponse({ description: 'Gagal' })
  async resetPassword(@Body() data: ResetPasswordUserDto, @Res() res: any) {
    const user = await this.userService.resetPassword(data);
    // console.log(user)
    if (typeof (user) === undefined || user.statusCode === 403) {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else if (user.statusCode === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else if (user.statusCode === 500) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else {
      return res.status(HttpStatus.OK).json(user)
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post('/checkResetPassword')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Check Data Reset Password with (basic-auth)' })
  @ApiOkResponse({ description: 'Sukses' })
  @ApiInternalServerErrorResponse({ description: 'Terjadi kesalahan dari server' })
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai' })
  @ApiForbiddenResponse({ description: 'Gagal' })
  async checkResetPassword(@Body() data: CheckResetPasswordUserDto, @Res() res: any) {
    const user = await this.userService.checkResetPassword(data);
    // console.log(user)
    if (typeof (user) === undefined || user.statusCode === 403) {
      return res.status(HttpStatus.FORBIDDEN).json(user);
    } else if (user.statusCode === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else if (user.statusCode === 500) {
      return res.status(HttpStatus.BAD_REQUEST).json(user);
    } else {
      return res.status(HttpStatus.OK).json(user)
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

  @UseGuards(JwtAuthGuard)
  @Get('/cekToken')
  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'Cek Token'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async cekTokens(@Request() req: any,) {
    const token = req.headers.authorization.replace('Bearer ', '')
    console.log(token)
    // const decodedToken = this.authService.decodeToken(token)
    // console.log(decodedToken)
    // return {
    //   message: 'token belum kadaluarsa',
    // };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('/refreshtoken')
  @ApiOperation({summary: 'Refresh Token'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async refreshToken(@Request() req, @Body() data: RefreshTokenUserDto){
    return await this.authService.userLogin(req.user);
  }
}
