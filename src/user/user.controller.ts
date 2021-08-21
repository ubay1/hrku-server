import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
      message: 'sukses mendpatkan data semua user',
      data: user
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
