import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, HttpStatus, UseGuards, HttpException, Req, Request } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('BlacklistController')
@Controller('blacklist')
export class BlacklistController {
  constructor(
    private readonly blacklistService: BlacklistService
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('/logout')
  // @ApiBearerAuth('access-token')
  // @ApiOperation({summary: 'Logout User'})
  // @ApiOkResponse({description: 'Sukses'})
  // @ApiInternalServerErrorResponse({description: 'Terjadi kesalahan dari server'})
  // @ApiBadRequestResponse({ description: 'Data yang dimasukan tidak sesuai'})
  // @ApiForbiddenResponse({ description: 'Gagal'})
  // async logout(@Request() req: any,) {
  //   const token = await req.headers.authorization.replace('Bearer ', '')
  //   const saveTokenBlackList = await this.blacklistService.logout(token)
  //   return saveTokenBlackList;
  // }
}