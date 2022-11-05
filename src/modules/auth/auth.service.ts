import { Injectable, HttpException } from "@nestjs/common";
import { jwtConstants } from "./constants";
import { JwtService } from "@nestjs/jwt";
import { Request as TypeRequest, Response as TypeResponse } from "express";
import type { tokenPayload, refreshTokenPayload } from "./types/token";
import { compare, genSalt, hash } from "bcryptjs";

@Injectable()
export class AuthService {
  // 创建实例
  constructor(private readonly jwtService: JwtService) {}

  /**
   * @desc 生成token
   * @param _id 用户id
   * @param exp 过期时间（小时）默认1h
   * @return 生成的token
   */
  generateToken(_id: string, exp = 1): string {
    exp = Math.floor(Date.now() / 1000) + exp * 60 * 60; // 过期时间默认1h
    const iat = Math.floor(Date.now() / 1000); // 创建时间
    const payload: tokenPayload = {
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
      throw err;
    }
  }

  /**
   * @desc 生成refreshToken
   * @param _id 用户id
   * @param exp 过期时间（小时）默认七天168h
   * @return 生成的refreshToken
   */
  generateRefreshToken(_id: string, exp = 1): string {
    exp = Math.floor(Date.now() / 1000) + exp * 60 * 60 * 168; // 过期时间默认7d
    const iat = Math.floor(Date.now() / 1000); // 创建时间
    const payload: tokenPayload = {
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
      throw err;
    }
  }

  /**
   * @desc 校验token和refreshToken并对token进行刷新
   * @param req 请求
   * @param res 响应
   * @return 校验结果
   */
  verifyToken(req: TypeRequest, res: TypeResponse): tokenPayload | any {
    const { token, refreshToken } = req.cookies;
    if (token) {
      const result: tokenPayload = this.jwtService.verify(token, {
        publicKey: jwtConstants.cert,
        algorithms: ["RS256"],
        ignoreExpiration: true,
      });
      if (result.exp < Date.now() / 1000) {
        // token过期，尝试使用refreshToken刷新
        try {
          const result: refreshTokenPayload = this.jwtService.verify(
            refreshToken,
            {
              publicKey: jwtConstants.cert,
              algorithms: ["RS256"],
            }
          );
          const token = this.generateToken(result._id);
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60,
          });
          // refreshToken有效期过半则同时续期refreshToken
          if (result.exp - Date.now() / 1000 < (result.exp - result.iat) / 2) {
            const refreshToken = this.generateRefreshToken(result._id);
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
          }
          return this.jwtService.decode(token);
        } catch (err) {
          throw err;
        }
      } else return result;
    } else {
      // token不存在，使用refreshToken刷新
      try {
        const result: refreshTokenPayload = this.jwtService.verify(
          refreshToken,
          {
            publicKey: jwtConstants.cert,
            algorithms: ["RS256"],
          }
        );
        const token = this.generateToken(result._id);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60,
        });
        // refreshToken有效期过半则同时续期refreshToken
        if (result.exp - Date.now() < (result.exp - result.iat) / 2) {
          const refreshToken = this.generateRefreshToken(result._id);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
        }
        return this.jwtService.decode(token);
      } catch (err) {
        throw err;
      }
    }
  }
}
