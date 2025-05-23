import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({
    description: "The name of the user",
    minLength: 2,
    maxLength: 50,
  })
  @Expose()
  name: string;

  @ApiProperty({ description: "The email of the user" })
  @Expose()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    minLength: 6,
  })
  @Exclude()
  password: string;

  @ApiProperty({
    description: "The unique username of the user",
    minLength: 6,
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: "The avatar image of user",
    minLength: 6,
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: "The bio of user",
    minLength: 6,
  })
  @Expose()
  bio?: string;
}
