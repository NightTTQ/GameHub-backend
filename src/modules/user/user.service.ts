import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Injectable, HttpException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "../auth/auth.service";
import { Request, Response } from "express";
import type { tokenPayload } from "../../types/token";

import { compare, genSalt, hash } from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>,
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

  // async create(createRes: CreateUserDto) {
  //   try {
  //     const password = createRes.password;
  //     createRes.password = await hash(createRes.password, await genSalt());
  //     const createUser = new this.userModel(createRes);
  //     await createUser.save();
  //     createRes.password = password;
  //     return this.login(createRes);
  //   } catch (error) {
  //     if (error.code == "11000")
  //       throw new HttpException({ message: "Username already exists" }, 400);
  //     throw new HttpException(error, 400);
  //   }
  //   // return "This action adds a new user";
  // }

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
