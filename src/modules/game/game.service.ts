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
    const skip = params.skip || 0;
    const limit = params.limit ? Math.min(params.limit, 200) : 20;
    const type = params.type ? new RegExp(params.type, "ig") : null;
    const where: { type?: RegExp; visible: boolean } = { visible: true };
    if (type) where.type = type;
    const res = await this.gameModel
      .find(where, {
        name: true,
        platform: true,
        id: true,
        type: true,
        author: true,
        cover: true,
      })
      .skip(skip)
      .limit(limit)
      .exec();
    return res;
  }

  async findOne(id: number) {
    const where = { id: id, visible: true };
    const res = await this.gameModel.findOne(where).exec();
    return res;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }
}
