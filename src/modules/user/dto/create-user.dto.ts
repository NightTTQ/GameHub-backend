// import {  } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "test", description: "用户名", required: true })
  readonly username: string;
  @ApiProperty({ example: "password", description: "密码", required: true })
  password: string;
}
