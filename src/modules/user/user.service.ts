import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Injectable } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "../../auth/auth.service";

import { compare, genSalt, hash } from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService
  ) {}
  async login(loginRes: LoginUserDto) {
    const user = await this.userModel
      .findOne({ username: loginRes.username })
      .exec();

    if (!user) throw new HttpException({ message: "user not found" }, 401);
    if (await compare(loginRes.password, user.password)) {
      const token = this.authService.generateToken(user._id, 1);
      const refreshToken = this.authService.generateToken(user._id, 7 * 24);
      return { user, token, refreshToken };
    } else throw new HttpException({ message: "password error" }, 401);
  }

  async create(createRes: CreateUserDto) {
    try {
      const password = createRes.password;
      createRes.password = await hash(createRes.password, await genSalt());
      const createUser = new this.userModel(createRes);
      await createUser.save();
      createRes.password = password;
      return this.login(createRes);
    } catch (error) {
      if (error.code == "11000")
        throw new HttpException({ message: "Username already exists" }, 400);
      throw new HttpException(error, 400);
    }
    // return "This action adds a new user";
  }

  async info(headers: any) {
    try {
      const payload = this.authService.verifyToken(
        headers.authorization?.split(" ")[1]
      );
      return this.userModel.findOne({ _id: payload._id });
    } catch (error) {
      throw new HttpException(error, 200);
    }
  }

  async refreshToken(headers: any) {
    try {
      const { refreshtoken } = headers;
      const payload = this.authService.verifyToken(refreshtoken);
      
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // async findAll(): Promise<User[]> {
  //   return await this.userModel.find().exec();
  //   // return `This action returns all user`;
  // }

  // async findOne(query: any): Promise<User[]> {
  //   return await this.userModel.find(query);
  //   // return `This action returns a #${id} user`;
  // }

  // async update(_id: string, updateRes: UpdateUserDto): Promise<any> {
  //   return await this.userModel.updateOne({ _id: _id }, { $set: updateRes });
  // }

  // async remove(_id: string) {
  //   return await this.userModel.remove({ _id: _id });
  // }
}
