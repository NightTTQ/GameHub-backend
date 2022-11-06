import { HttpException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GameDocument } from "./game.schema";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { listParams } from "./types/index";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "../config/config.service";
import { Request, Response } from "express";

@Injectable()
export class GameService {
  constructor(
    @InjectModel("Game") private readonly gameModel: Model<GameDocument>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  async create(req: Request, res: Response) {
    // 验证权限
    const payload = this.authService.verifyToken(req, res);
    // 取出新游戏数据
    const body: CreateGameDto = req.body;
    // 获取游戏id
    const next_id = await this.configService.get("next_game_id");
    // 整理游戏数据
    const data = {
      id: next_id,
      name: body.name,
      author: body.author,
      type: body.type,
      platform: body.platform,
      releaseDate: body.releaseDate,
      cover: body.cover,
      user: payload._id,
    };
    // 创建游戏
    const newGame = await this.gameModel.create(data);
    // 更新id设置
    await this.configService.set("next_game_id", Number(next_id) + 1);
    res.statusCode = 200;
    res.send({
      code: 200,
      data: newGame,
      message: "success",
    });
  }

  async updateGame(req: Request, res: Response, id: string) {
    // 验证权限
    const payload = this.authService.verifyToken(req, res);
    // 取出更新数据
    const data: UpdateGameDto = req.body;
    const game = await this.gameModel.findOne({ id: id }).exec();
    if (
      game &&
      (game.user === payload._id || game.editor.includes(payload._id))
    ) {
      // 确认游戏存在且拥有编辑权限
      const newGame = await this.gameModel
        .findOneAndUpdate({ id: id }, data, {
          new: true,
        })
        .exec();
      res.statusCode = 200;
      res.send({ code: 200, data: newGame, message: "success" });
    } else {
      // 游戏不存在或无权编辑
      throw new HttpException("You have no permission to edit", 200);
    }
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

  async show(req: Request, res: Response, id: string) {
    const game = await this.gameModel.findOne({ id: id }).exec();
    if (!game) throw new HttpException("", 404);
    if (game.visible === true) {
      res.statusCode = 200;
      res.send({ code: 200, data: game, message: "success" });
    } else {
      const payload = this.authService.verifyToken(req, res);
      if (game.user === payload._id || game.editor.includes(payload._id)) {
        res.statusCode = 200;
        res.send({ code: 200, data: game, message: "success" });
      } else throw new HttpException("You have no permission to view", 200);
    }
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }
}
