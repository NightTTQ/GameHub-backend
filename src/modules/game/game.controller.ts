import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { listParams } from "./types/index";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get("list")
  list(@Query() params: listParams) {
    return this.gameService.list(params);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gameService.findOne(+id);
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateGameDto: UpdateGameDto) {
  //   return this.gameService.update(+id, updateGameDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.gameService.remove(+id);
  // }
}
