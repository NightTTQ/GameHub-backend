// Core Packages
import { Module } from "@nestjs/common";

// NPM Packages
import { MongooseModule } from "@nestjs/mongoose";

// Custom Packages
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { GameSchema } from "./game.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Game", schema: GameSchema }])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
