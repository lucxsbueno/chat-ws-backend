import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "The name of the user",
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: "The email of the user" })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "The unique username of the user",
    minLength: 6,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: "The avatar image of user",
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: "The bio of user",
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
