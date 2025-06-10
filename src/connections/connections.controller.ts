import { Controller, Post, Get, Param, Body, Query } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";

@Controller("connections")
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post("request/:accepterId")
  async createConnectionRequest(
    @Body("userId") requesterId: string,
    @Param("accepterId") accepterId: string,
  ) {
    return this.connectionsService.createConnectionRequest(
      requesterId,
      accepterId,
    );
  }

  @Post(":connectionId/accept")
  async acceptConnectionRequest(
    @Param("connectionId") connectionId: string,
    @Body("userId") userId: string,
  ) {
    return this.connectionsService.acceptConnectionRequest(
      connectionId,
      userId,
    );
  }

  @Post(":connectionId/reject")
  async rejectConnectionRequest(
    @Param("connectionId") connectionId: string,
    @Body("userId") userId: string,
  ) {
    return this.connectionsService.rejectConnectionRequest(
      connectionId,
      userId,
    );
  }

  @Get(":userId")
  async getConnections(
    @Param("userId") userId: string,
    @Query("status") status?: "pending" | "accepted" | "rejected",
  ) {
    return this.connectionsService.getConnections(userId, status);
  }
}
