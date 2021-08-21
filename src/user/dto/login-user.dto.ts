import { ApiProperty } from "@nestjs/swagger";
import * as moment from "moment";

export class LoginUserDto {
  @ApiProperty({type: String, default: 'aku@gmail.com'})
  readonly email: string;

  @ApiProperty({type: String, default: 'passwordaku'})
  password: string;
}
