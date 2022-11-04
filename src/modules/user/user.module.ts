// Core Packages
import { Module } from "@nestjs/common";

// NPM Packages
import { MongooseModule } from "@nestjs/mongoose";

// Custom Packages
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserSchema } from "./user.schema";
import { GameSchema } from "../game/game.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Game", schema: GameSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
