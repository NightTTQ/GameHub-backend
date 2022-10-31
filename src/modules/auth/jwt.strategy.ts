import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Response } from "@nestjs/common";
import { Request as TypeRequest, Response as TypeResponse } from "express";
import { jwtConstants } from "./constants";
import { User } from "../user/user.schema";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: TypeRequest): string | null => {
          return request.cookies["token"] || null;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.cert,
    });
  }

  async validate(payload: any): Promise<User | null> {
    // TODO:检查token有效期，过期则再判断refreshToken进行双token刷新
    return payload;
  }
}
