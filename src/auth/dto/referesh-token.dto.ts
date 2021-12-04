import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenUserDto {
  @ApiProperty({type: String})
  readonly access_token: string;

  @ApiProperty({type: String})
  readonly refresh_token: string;
}
