import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Headers,
  Request,
  Response,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiHeaders,
} from "@nestjs/swagger";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorators";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request as TypeRequest, Response as TypeResponse } from "express";

@Controller("user")
@UseGuards(RolesGuard)
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  @ApiOperation({ summary: "用户登录", description: "用户登录" })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: "用户登录成功返回200" })
  @UseGuards(AuthGuard("local"))
  @Roles()
  login(@Body() loginRes: LoginUserDto, @Response() res: TypeResponse) {
    return this.userService.login(loginRes, res);
  }

  // @Post("register")
  // @ApiOperation({ summary: "用户注册", description: "用户注册" })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({ status: 200, description: "用户创建成功返回200" })
  // create(@Body() createRes: CreateUserDto) {
  //   return this.userService.create(createRes);
  // }

  @Get("info")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "获取用户信息", description: "获取用户信息" })
  @ApiResponse({ status: 200, description: "成功获取用户信息返回200" })
  info(@Request() req: TypeRequest, @Response() res: TypeResponse) {
    return this.userService.info(req, res);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userService.remove(id);
  // }
}
