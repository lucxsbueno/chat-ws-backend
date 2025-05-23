import { Controller, Get, Param, Delete } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get chat by id." })
  @ApiResponse({
    status: 200,
    description: "Return the chat by id.",
  })
  @ApiResponse({ status: 404, description: "Chat not found." })
  findOne(@Param("id") id: string) {
    return this.chatsService.findOne(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete chat by id." })
  @ApiResponse({
    status: 200,
    description: "Return the chat by id.",
  })
  @ApiResponse({ status: 404, description: "Chat not found." })
  remove(@Param("id") id: string) {
    return this.chatsService.remove(id);
  }
}
