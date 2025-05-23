import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { ApiResponse } from "@nestjs/swagger";
import { UpdateUserDto } from "src/users/dto/update-user.dto";

@Controller("channels")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new channel" })
  @ApiResponse({
    status: 201,
    description: "The channel has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  async create(@Body() createChannelDto: CreateChannelDto) {
    return await this.channelsService.create(createChannelDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all channels" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search term for channels",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of items per page",
    type: Number,
  })
  @ApiQuery({
    name: "sort",
    required: false,
    description:
      "Sorting keys and directions, e.g. 'name:asc,description:desc'",
    type: String,
  })
  @ApiResponse({ status: 200, description: "Return all channels." })
  findAll(
    @Query("search", new DefaultValuePipe("")) search: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query("sort", new DefaultValuePipe("")) sort: string,
  ) {
    return this.channelsService.findAll(search, page, limit, sort);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by id" })
  @ApiResponse({ status: 200, description: "Return the user." })
  @ApiResponse({ status: 404, description: "User not found." })
  findOne(@Param("id") id: string) {
    return this.channelsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an user" })
  @ApiResponse({ status: 200, description: "Return the user." })
  @ApiResponse({ status: 404, description: "User not found." })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.channelsService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "User not found." })
  remove(@Param("id") id: string) {
    return this.channelsService.remove(id);
  }
}
