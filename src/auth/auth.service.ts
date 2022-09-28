import { Injectable } from "@nestjs/common";
// import { UserService } from "../user/user.service";
import { jwtConstants } from "./constants";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  // 创建实例
  constructor(
    // private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * @desc 生成token
   * @param _id 用户id
   * @param exp 过期时间（小时）默认1h
   * @return 生成的token
   */
  generateToken(_id: string, exp = 1): string {
    exp = Math.floor(Date.now() / 1000) + exp * 60 * 60; // 过期时间默认1h
    const iat = Math.floor(Date.now() / 1000); // 创建时间
    const payload = {
      _id,
      exp,
      iat,
    };
    try {
      const token = this.jwtService.sign(payload, {
        algorithm: "RS256",
        privateKey: jwtConstants.key,
      });
      return token;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @desc 校验token
   * @param token 需要校验的token
   * @return 校验结果
   */
  verifyToken(token: string): any {
    const result = this.jwtService.verify(token, {
      publicKey: jwtConstants.cert,
      algorithms: ["RS256"],
    });
    return result;
  }
}
