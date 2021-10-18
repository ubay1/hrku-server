import { ApiProperty } from "@nestjs/swagger";
export class UpdateUserDto {
  
  @ApiProperty({type: String, default: 'aku'})
  readonly fullname: string;
  
  @ApiProperty({type: String, default: 'jakarta'})
  readonly address: string;
  
  @ApiProperty({type: String, default: '021'})
  readonly phone: string;
  
  @ApiProperty({type: String, default: ''})
  readonly gender: string;
  
  // @ApiProperty({type: Number, default: 0})
  // readonly roleId: number;
}
