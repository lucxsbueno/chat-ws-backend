import { Controller, Post, Body } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ApiResponse } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: "Create a message." })
  @ApiResponse({
    status: 200,
    description: "The message has been successfully created.",
  })
  @ApiResponse({ status: 500, description: "Erro ao criar mensagem." })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }
}
