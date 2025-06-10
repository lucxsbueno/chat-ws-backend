import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  async createConnectionRequest(requesterId: string, accepterId: string) {
    // Check if users exist
    const [requester, accepter] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: requesterId } }),
      this.prisma.user.findUnique({ where: { id: accepterId } }),
    ]);

    if (!requester || !accepter) {
      throw new NotFoundException("User not found");
    }

    // Check if connection already exists
    const existingConnection = await this.prisma.connection.findFirst({
      where: {
        OR: [
          {
            requesterId,
            accepterId,
          },
          {
            requesterId: accepterId,
            accepterId: requesterId,
          },
        ],
      },
    });

    if (existingConnection) {
      throw new BadRequestException("Connection already exists");
    }

    // Create new connection request
    return this.prisma.connection.create({
      data: {
        requesterId,
        accepterId,
        status: "pending",
      },
    });
  }

  async acceptConnectionRequest(connectionId: string, userId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException("Connection request not found");
    }

    if (connection.accepterId !== userId) {
      throw new BadRequestException(
        "You are not authorized to accept this request",
      );
    }

    if (connection.status !== "pending") {
      throw new BadRequestException(
        "This connection request is no longer pending",
      );
    }

    return this.prisma.connection.update({
      where: { id: connectionId },
      data: { status: "accepted" },
    });
  }

  async rejectConnectionRequest(connectionId: string, userId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException("Connection request not found");
    }

    if (connection.accepterId !== userId) {
      throw new BadRequestException(
        "You are not authorized to reject this request",
      );
    }

    if (connection.status !== "pending") {
      throw new BadRequestException(
        "This connection request is no longer pending",
      );
    }

    return this.prisma.connection.update({
      where: { id: connectionId },
      data: { status: "rejected" },
    });
  }

  async getConnections(
    userId: string,
    status?: "pending" | "accepted" | "rejected",
  ) {
    const where: any = {
      OR: [{ requesterId: userId }, { accepterId: userId }],
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.connection.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        accepter: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }
}
