import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request as TypeRequest, Response as TypeResponse } from "express";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { listParams } from "./types/index";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post("create")
  create(@Request() req: TypeRequest, @Response() res: TypeResponse) {
    return this.gameService.create(req, res);
  }

  @Get("list")
  list(@Query() params: listParams) {
    return this.gameService.list(params);
  }

  @Get(":id")
  findOne(
    @Request() req: TypeRequest,
    @Response() res: TypeResponse,
    @Param("id") id: string
  ) {
    return this.gameService.show(req, res, id);
  }

  @Patch("update/:id")
  updateGame(
    @Request() req: TypeRequest,
    @Response() res: TypeResponse,
    @Param("id") id: string
  ) {
    return this.gameService.updateGame(req, res, id);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.gameService.remove(+id);
  // }
}
