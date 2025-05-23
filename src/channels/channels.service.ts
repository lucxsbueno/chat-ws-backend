import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createChannelDto: CreateChannelDto) {
    const { name, description, userId } = createChannelDto;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado.");
      }

      const channel = await this.prismaService.channel.create({
        data: {
          name,
          description,
          userId: user.id,
        },
      });

      if (!channel) {
        throw new InternalServerErrorException("Erro ao criar canal.");
      }

      const chat = await this.prismaService.chat.create({
        data: {
          channelId: channel.id,
        },
      });

      if (!chat) {
        throw new InternalServerErrorException("Erro ao criar chat.");
      }

      return channel;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(search: string, page: number, limit: number, sort: string) {
    const skip = (page - 1) * limit;
    const take = limit;

    // Campos permitidos para ordenação
    const validKeys = ["name", "description", "createdAt", "updatedAt"];
    const validDirections = ["asc", "desc"];

    let orderBy: OrderByChannel[] = [];

    if (sort) {
      const sortItems = sort.split(",");
      for (const item of sortItems) {
        const [key, direction] = item.split(":");
        if (
          key &&
          direction &&
          validKeys.includes(key) &&
          validDirections.includes(direction.toLowerCase())
        ) {
          orderBy.push({ [key]: direction.toLowerCase() } as OrderByUser);
        }
      }
    }

    // Se não tiver nenhum parâmetro válido, ordena por createdAt asc por padrão
    if (orderBy.length === 0) {
      orderBy = [{ createdAt: "desc" }];
    }

    const channels = await this.prismaService.channel.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      skip,
      take,
      orderBy,
    });

    const total = await this.prismaService.channel.count({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });

    return {
      data: channels,
      meta: {
        total,
        page,
        nextPage: page + 1,
        previousPage: page - 1,
      },
    };
  }

  async findOne(id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException("Canal não encontrado.");
    }

    return channel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException("Canal não encontrado.");
    }

    return this.prismaService.channel.update({
      where: { id },
      data: updateChannelDto,
    });
  }

  async remove(id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException("Canal não encontrado.");
    }

    return this.prismaService.channel.delete({
      where: { id },
    });
  }
}
