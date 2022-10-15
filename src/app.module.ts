import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";

import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      `${process.env.NEST_MONGODB_URL || "mongodb://127.0.0.1:27017"}/gamehub`
    ),
    AuthModule,
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
