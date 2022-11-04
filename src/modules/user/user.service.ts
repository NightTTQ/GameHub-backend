import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { GameDocument } from "../game/game.schema";
import { Injectable, HttpException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "../auth/auth.service";
import { Request, Response } from "express";
import type { tokenPayload } from "../auth/types/token";

import { compare, genSalt, hash } from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>,
    @InjectModel("Game") private readonly gameModel: Model<GameDocument>,
    private readonly authService: AuthService
  ) {}

  async login(loginRes: LoginUserDto, res: Response) {
    const user = await this.userModel
      .findOne({ username: loginRes.username })
      .exec();

    if (!user) throw new HttpException({ message: "user not found" }, 401);
    if (await compare(loginRes.password, user.password)) {
      const token = this.authService.generateToken(user._id);
      const refreshToken = this.authService.generateRefreshToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.statusCode = 200;
      res.send({
        data: user,
        code: 200,
        message: "success",
      });
    } else throw new HttpException({ message: "password error" }, 401);
  }

  async create(createRes: CreateUserDto, res: Response) {
    try {
      const password = createRes.password;
      createRes.password = await hash(createRes.password, await genSalt());
      const createUser = new this.userModel(createRes);
      await createUser.save();
      createRes.password = password;
      return this.login(createRes, res);
    } catch (error) {
      if (error.code == "11000")
        throw new HttpException({ message: "Username already exists" }, 400);
      throw new HttpException(error, 400);
    }
    // return "This action adds a new user";
  }

  async info(req: Request, res: Response) {
    try {
      const payload: tokenPayload = this.authService.verifyToken(req, res);
      const user = await this.userModel.findOne({ _id: payload._id }).exec();
      res.send({
        data: user,
        code: 200,
        message: "success",
      });
    } catch (error) {
      throw new HttpException(error, 200);
    }
  }

  async logout(res: Response) {
    res.cookie("token", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
    res.send({
      code: 200,
      message: "success",
    });
  }

  async findUserGame(req: Request, res: Response) {
    try {
      // 通过token获取用户_id
      const { _id } = this.authService.verifyToken(req, res);

      if (req.query["id"]) {
        // 请求指定了游戏id则取出相应的数据
        const data = await this.gameModel
          .findOne({ id: req.query["id"] })
          .exec();
        if (data.user !== _id && !data.editor.includes(_id)) {
          // 用户无权限编辑
          throw new HttpException("You have no permission to edit", 200);
        } else {
          // 用户有编辑权限正常返回
          res.send({
            code: 200,
            data: data,
            message: "success",
          });
        }
      } else {
        // 未指定游戏id则找出用户全部可编辑游戏
        const own = await this.gameModel.find({ user: _id }).exec();
        const edit = await this.gameModel
          .find({
            editor: new RegExp(_id, "gi"),
          })
          .exec();
        res.send({
          code: 200,
          data: { own: own, editor: edit },
          message: "success",
        });
      }
    } catch (error) {
      throw new HttpException(error, 200);
    }
  }

  // async findAll(): Promise<User[]> {
  //   return await this.userModel.find().exec();
  //   // return `This action returns all user`;
  // }

  async findOne(query: any): Promise<User> {
    return await this.userModel.findOne(query);
  }

  // async update(_id: string, updateRes: UpdateUserDto): Promise<any> {
  //   return await this.userModel.updateOne({ _id: _id }, { $set: updateRes });
  // }

  // async remove(_id: string) {
  //   return await this.userModel.remove({ _id: _id });
  // }
}
