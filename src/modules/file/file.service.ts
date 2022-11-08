import { HttpException, Injectable } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { AuthService } from "../auth/auth.service";
import { Request, Response } from "express";
const qiniu = require("qiniu");

@Injectable()
export class FileService {
  constructor(private readonly authService: AuthService) {}
  async getConfig(req: Request, res: Response) {
    // 验证用户权限
    const payload = this.authService.verifyToken(req, res);
    const token = await this.tokenQiniu();
    res.statusCode = 200;
    res.send({
      code: 200,
      data: {
        token: token,
        url: process.env.QINIU_URL,
        domain: process.env.QINIU_DOMAIN,
      },
      message: "success",
    });
  }

  async tokenQiniu() {
    const accessKey = process.env.QINIU_AK;
    const secretKey = process.env.QINIU_SK;
    // 这里还可以做个缓存
    try {
      // 定义七牛云鉴权对象
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      // 定义上传凭证配置
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: process.env.QINIU_SCOPE,
        expires: 3600,
      });
      // 获取上传token
      const token = putPolicy.uploadToken(mac);
      return token;
    } catch (error) {
      throw new HttpException(error, 200);
    }
  }

  async tokenSM() {
    const username = "";
    const password = "";
    const url = "https://sm.ms/api/v2";
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  }
}
