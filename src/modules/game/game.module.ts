// Core Packages
import { Module } from "@nestjs/common";

// NPM Packages
import { MongooseModule } from "@nestjs/mongoose";

// Custom Packages
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { GameSchema } from "./game.schema";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Game", schema: GameSchema }]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
