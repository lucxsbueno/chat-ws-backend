import { IsNotEmpty, IsOptional } from "class-validator";

import { IsString } from "class-validator";

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
