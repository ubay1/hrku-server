import { ApiProperty } from "@nestjs/swagger";
export class ResetPasswordUserDto {

  @ApiProperty({ type: String, default: '' })
  readonly email: string;

  @ApiProperty({ type: String, default: '' })
  readonly new_password: string;

  @ApiProperty({ type: String, default: '' })
  readonly new_password_confirm: string;
}
