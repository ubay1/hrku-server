import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordUserDto {
  @ApiProperty({ type: String, default: '' })
  readonly email: any;
}
