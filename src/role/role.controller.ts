import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('RoleController')
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService
  ) {}

  @Post()
  @ApiOperation({summary: 'Create New Role'})
  @ApiCreatedResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async create(@Body() data: CreateRoleDto) {
    const role = await this.roleService.create(data)
    return {
      message: 'sukses membuat role',
      data: role
    };
  }

  @Get()
  @ApiOperation({summary: 'Get All Role'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async findAll() {
    const role = await this.roleService.findAll()
    return {
      message: 'sukses mendpaatkan data semua role',
      data: role
    };
  }

  @Get(':id')
  @ApiOperation({summary: 'Get Role By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(id)
    return {
      message: `sukses mendapatkan data role by id`,
      data: role
    };
  }

  @Put(':id')
  @ApiOperation({summary: 'Update Role By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async update(@Param('id') id: number, @Body() updateRoleDto: CreateRoleDto) {
    const role = this.roleService.update(id, updateRoleDto);
    return {
      message: role,
    };
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete Role By ID'})
  @ApiOkResponse({description: 'Sukses'})
  @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  @ApiForbiddenResponse({ description: 'Gagal'})
  async remove(@Param('id') id: number) {
    const role = await this.roleService.remove(id);
    // console.log(role)
    return {
      message: role,
    };
  }
}
