import { ApiProperty } from "@nestjs/swagger";
export class UpdateFotoUserDto {
  // @ApiProperty({type: Number, default: 0})
  // readonly roleId: number;

  @ApiProperty({type: String, default: ''})
  readonly foto: any;
}
