import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma.service";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, username } = createUserDto;

    const user = await this.findByEmail(email);

    if (user) {
      throw new ConflictException("Já existe um usuário com este e-mail.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const createdUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          username,
        },
      });

      return plainToInstance(UserResponseDto, createdUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Erro interno do servidor.");
    }
  }

  async findAll(search: string, page: number, limit: number, sort: string) {
    const skip = (page - 1) * limit;
    const take = limit;

    // Campos permitidos para ordenação
    const validKeys = [
      "id",
      "name",
      "email",
      "username",
      "avatar",
      "bio",
      "createdAt",
      "updatedAt",
    ];
    const validDirections = ["asc", "desc"];

    let orderBy: OrderByUser[] = [];

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

    const users = await this.prisma.user.findMany({
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      },
      skip,
      take,
      orderBy,
    });

    const total = await this.prisma.user.count({
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      },
    });

    return {
      data: users,
      meta: {
        total,
        page,
        nextPage: page + 1,
        previousPage: page - 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (updateUserDto.password) {
      throw new BadRequestException(
        "A senha não pode ser atualizada diretamente. Por favor, use a função 'redefinir senha' para alterar sua senha.",
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
