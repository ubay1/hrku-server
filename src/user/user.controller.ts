import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  @ApiOperation({summary: 'Save Data User'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async create(@Body() data: CreateUserDto) {
    const user = await  this.userService.create(data);
    return {
      message: 'sukses membuat user',
      data: user
    }
  }

  @Get()
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

  @Get(':id')
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

  @Put(':id')
  @ApiOperation({summary: 'Update User By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const role = this.userService.update(id, updateUserDto);
    return role;
  }

  @Delete(':id')
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
