// 引入所需内置对象
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import * as dayjs from "dayjs";

// 需要访问底层平台 `Request`和 `Response`
import { Request, Response } from "express";

// 它负责捕获作为`HttpException`类实例
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // 用于接收主动发错的错误信息
    const message = exception.getResponse() as any;
    response.status(status).json({
      code: status,
      timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      path: request.url,
      error: message || "Bad Request",
    });
  }
}
