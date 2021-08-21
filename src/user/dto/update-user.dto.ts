import { ApiProperty } from "@nestjs/swagger";
import * as moment from "moment";

const datenow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); 

function randomString(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *  charactersLength));
  }
  return result;
}
export class UpdateUserDto {
  @ApiProperty({type: Number, default: 0})
  readonly roleId: number;

  @ApiProperty({type: String, default: 'aku'})
  readonly fullname: string;

  @ApiProperty({type: String, default: 'jakarta'})
  readonly address: string;
  
  @ApiProperty({type: String, default: '021'})
  readonly phone: string;

  @ApiProperty({type: String, default: 'aku@gmail.com'})
  readonly email: string;

  // @ApiProperty({type: String, default: 'passwordaku'})
  // readonly password: string;

  @ApiProperty({type: String, default: ''})
  readonly no_rekening: string;

  @ApiProperty({type: String, default: ''})
  readonly no_bpjs: string;
}
