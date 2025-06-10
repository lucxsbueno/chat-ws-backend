import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
