import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    try {
      const chat = await this.prismaService.chat.findUnique({
        where: {
          id,
        },
        include: {
          channel: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          messages: {
            select: {
              id: true,
              type: true,
              body: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!chat) {
        throw new NotFoundException("Chat não encontrado");
      }

      return chat;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Erro interno do servidor");
    }
  }

  async remove(id: string) {
    try {
      const chat = await this.prismaService.chat.findUnique({
        where: {
          id,
        },
      });

      if (!chat) {
        throw new NotFoundException("Chat não encontrado");
      }

      return await this.prismaService.chat.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro interno do servidor");
    }
  }
}
