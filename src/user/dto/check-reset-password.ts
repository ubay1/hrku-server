import { ApiProperty } from "@nestjs/swagger";
export class CheckResetPasswordUserDto {

  @ApiProperty({ type: String, default: '' })
  readonly email: string;
}
