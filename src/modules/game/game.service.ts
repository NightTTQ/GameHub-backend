import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GameDocument } from "./game.schema";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { listParams } from "./types/index";

@Injectable()
export class GameService {
  constructor(
    @InjectModel("Game") private readonly gameModel: Model<GameDocument>
  ) {}

  create(createGameDto: CreateGameDto) {
    return "This action adds a new game";
  }

  async list(params: listParams) {
    console.log(params);
    const skip = params.skip || 0;
    const limit = Math.min(params.limit, 200);
    const type = params.type ? new RegExp(params.type, "ig") : null;
    const where: { type?: RegExp } = {};
    if (type) where.type = type;
    const res = await this.gameModel.find(where).skip(skip).limit(limit).exec();
    return res;
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
