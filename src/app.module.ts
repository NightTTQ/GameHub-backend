import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";

import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { GameModule } from "./modules/game/game.module";
import { FileModule } from "./modules/file/file.module";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRoot(
      process.env.NEST_MONGODB_URL,
      {
        auth: {
          username: process.env.NEST_MONGODB_USER,
          password: process.env.NEST_MONGODB_PASS,
        },
      }
    ),
    UserModule,
    AuthModule,
    GameModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "test", method: RequestMethod.POST })
      .forRoutes("");
  }
}
