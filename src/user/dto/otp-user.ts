import { ApiProperty } from "@nestjs/swagger";

export class OtpUserDto {
  @ApiProperty({ type: String, default: '' })
  readonly email: any;
  @ApiProperty({ type: String, default: '' })
  readonly otp: any;
}
