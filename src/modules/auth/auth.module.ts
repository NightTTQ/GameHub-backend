// Core Packages
import { Module } from "@nestjs/common";

// NPM Packages
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

// Custom Packages
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { UserSchema } from "../user/user.schema";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      publicKey: jwtConstants.cert,
      privateKey: jwtConstants.key,
    }),
    // MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    // UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
