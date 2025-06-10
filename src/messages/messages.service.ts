import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const chatExists = await this.prismaService.chat.findUnique({
        where: { id: createMessageDto.chatId },
      });

      if (!chatExists) {
        throw new BadRequestException(
          `Chat com o id ${createMessageDto.chatId} não existe.`,
        );
      }

      const userExists = await this.prismaService.user.findUnique({
        where: { id: createMessageDto.userId },
      });

      if (!userExists) {
        throw new BadRequestException(
          `Usuário com o id ${createMessageDto.userId} não existe.`,
        );
      }

      await this.prismaService.message.create({
        data: createMessageDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
