import { ApiProperty } from "@nestjs/swagger";
export class UpdateUserDto {
  // @ApiProperty({type: Number, default: 0})
  // readonly roleId: number;

  @ApiProperty({type: String, default: 'aku'})
  readonly fullname: string;

  @ApiProperty({type: String, default: 'jakarta'})
  readonly address: string;
  
  @ApiProperty({type: String, default: '021'})
  readonly phone: string;

  @ApiProperty({type: String, default: ''})
  readonly no_rekening: string;

  @ApiProperty({type: String, default: ''})
  readonly no_bpjs: string;

  @ApiProperty({type: String, default: ''})
  readonly gender: string;
}
