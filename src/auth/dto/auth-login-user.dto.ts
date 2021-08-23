import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginUserDto {
  @ApiProperty({type: String, default: 'aku@gmail.com'})
  readonly email: string;

  @ApiProperty({type: String, default: 'passwordaku'})
  readonly password: string;
}
