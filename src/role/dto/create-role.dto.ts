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

export class CreateRoleDto {
  @ApiProperty({type: String, default: 'CEO'})
  readonly role_name: string;

  @ApiProperty({type: String, default: 'ceo'})
  readonly slug_role_name: string;

  // @ApiProperty({type: String, default: datenow})
  // readonly created_at: string;

  // @ApiProperty({type: String, default: datenow})
  // readonly updated_at: string;
}