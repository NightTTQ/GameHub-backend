// Core Packages
import { Module } from "@nestjs/common";

// NPM Packages
import { MongooseModule } from "@nestjs/mongoose";

// Custom Packages
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
