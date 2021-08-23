import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({type: String, default: ''})
  readonly Authorization: string;
}
