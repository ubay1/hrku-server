import { ApiProperty } from "@nestjs/swagger";
export class ResetPasswordUserDto {
  @ApiProperty({ type: String, default: '' })
  readonly reset_password_token: any;
}
