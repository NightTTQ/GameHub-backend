import { NestFactory } from "@nestjs/core";
import * as CookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filters/exception.filter";
import { TransformInterceptor } from "./common/interceptor/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(CookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  const swaggerOptions = new DocumentBuilder()
    .setTitle("GameHub API Document")
    .setDescription("GameHub API document")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup("doc", app, document);
  await app.listen(7002);
}
bootstrap();
