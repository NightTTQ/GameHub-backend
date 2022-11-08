import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Response,
} from "@nestjs/common";
import { Request as TypeRequest, Response as TypeResponse } from "express";

import { FileService } from "./file.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get("token")
  getConfig(@Request() req: TypeRequest, @Response() res: TypeResponse) {
    return this.fileService.getConfig(req, res);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.fileService.remove(+id);
  // }
}
