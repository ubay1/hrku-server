import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDto {
  @ApiProperty({type: String, default: ''})
  readonly token: string;
}
