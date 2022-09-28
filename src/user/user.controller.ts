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
} from "@nestjs/common";
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiHeaders,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  @ApiOperation({ summary: "用户登录", description: "用户登录" })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: "用户登录成功返回200" })
  login(@Body() loginRes: LoginUserDto) {
    return this.userService.login(loginRes);
  }

  @Post("register")
  @ApiOperation({ summary: "用户注册", description: "用户注册" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: "用户创建成功返回200" })
  create(@Body() createRes: CreateUserDto) {
    return this.userService.create(createRes);
  }

  @Get("info")
  @ApiOperation({ summary: "获取用户信息", description: "获取用户信息" })
  @ApiHeaders([{ name: "token", description: "需要获取信息的用户token" }])
  @ApiResponse({ status: 200, description: "成功获取用户信息返回200" })
  info(@Headers() headers: any) {
    return this.userService.info(headers);
  }

  @Get("refreshToken")
  @ApiOperation({
    summary: "获取新token",
    description: "使用refreshToken获取新token",
  })
  @ApiHeaders([{ name: "refreshToken", description: "用户的refreshToken" }])
  @ApiResponse({ status: 200, description: "成功获取新token返回200" })
  refreshToken(@Headers() headers: any) {}
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

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
