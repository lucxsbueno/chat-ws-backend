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
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search term for users",
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
    description: "Sorting keys and directions, e.g. 'name:asc,email:desc'",
    type: String,
  })
  @ApiResponse({ status: 200, description: "Return all users." })
  findAll(
    @Query("search", new DefaultValuePipe("")) search: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query("sort", new DefaultValuePipe("")) sort: string,
  ) {
    return this.userService.findAll(search, page, limit, sort);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by id" })
  @ApiResponse({ status: 200, description: "Return the user." })
  @ApiResponse({ status: 404, description: "User not found." })
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an user" })
  @ApiResponse({ status: 200, description: "Return the user." })
  @ApiResponse({ status: 404, description: "User not found." })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "User not found." })
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
